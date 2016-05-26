package io.srounce.reactnativeindooratlas;

import android.util.Log;
import android.app.Activity;
import android.content.Intent;
import android.content.Context;
import android.location.Location;
import android.Manifest;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.support.v4.app.ActivityCompat;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.Nullable;

import android.content.Context;

import com.indooratlas.android.sdk.*;

public class IndoorAtlasReactNativePlugin 
  extends ReactContextBaseJavaModule
  implements ActivityEventListener, IALocationListener, IARegion.Listener
{
  public static final String TAG = "ReactNativeIndoorAtlas";
  public static final int CODE_PERMISSIONS = 1;

  private ReactApplicationContext mAppContext;
  private IALocationManager mLocationManager;

  public IndoorAtlasReactNativePlugin(final ReactApplicationContext context) {
    super(context);

    context.addActivityEventListener(this);

    final IndoorAtlasReactNativePlugin self = this;
    Handler mainHandler = new Handler(Looper.getMainLooper());
    mainHandler.post(new Runnable() {
      @Override
      public void run() {
        mLocationManager = IALocationManager.create(context);
        Boolean result = mLocationManager.requestLocationUpdates(IALocationRequest.create(), self);
        Log.d("RNIA", String.format("Registered for events: %b", result));
      }
    });

    mAppContext = context;
    mAppContext.addActivityEventListener(this);
  }

  private void onResume() {
    final IndoorAtlasReactNativePlugin self = this;

    Handler mainHandler = new Handler(Looper.getMainLooper());
    mainHandler.post(new Runnable() {
      @Override
      public void run() {
        mLocationManager.registerRegionListener(self);
      }
    });
  }

  private void onPause() {
    final IndoorAtlasReactNativePlugin self = this;

    Handler mainHandler = new Handler(Looper.getMainLooper());
    mainHandler.post(new Runnable() {
      @Override
      public void run() {
        mLocationManager.unregisterRegionListener(self);
      }
    });
  }

  @Override
  public String getName() {
    return TAG;
  }

  @Override
  public boolean canOverrideExistingModule() {
    return false;
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    Log.d("RNIA", String.format("requestCode: %d\n resultCode: %d\n", requestCode, resultCode));
  }

  //@Override
  public void onRequestPermissionsResult(
      int requestCode,
      String[] permissions,
      int[] grantedResults
  ) {
    //super.onRequestPermissionsResult(requestCode, permissions, grantedResults);
  }

  @ReactMethod
  public void getVersion(final Promise promise) {
    promise.resolve(IALocationManager.getVersion());
  }

  @ReactMethod
  public void setLocationById(
      final String floorplanId,
      final Promise promise
  ) {
    Handler mainHandler = new Handler(Looper.getMainLooper());
    mainHandler.post(new Runnable() {
      @Override
      public void run() {
        try {
          IARegion region = IARegion.venue(floorplanId);
          IALocation location = IALocation.from(region);
          mLocationManager.setLocation(location);

          promise.resolve(true);
        } catch(Exception e) {
          promise.reject(e.toString());
        }
      }
    });
  }

  @ReactMethod
  public void setApiKey(String apiKey, String apiSecret, final Promise promise) {
    promise.reject("This method should not be called on Android. Please set the API key/secret in AndroidManifest.xml");
  }

  @Override
  public void onEnterRegion(IARegion region) {
    Log.d("RNIA", String.format("onEnterRegion %s", region.toString()));
    WritableMap params = Arguments.createMap();
    this.sendEvent("onEnterRegion", params);
  }

  @Override
  public void onExitRegion(IARegion region) {
    Log.d("RNIA", String.format("onExitRegion %s", region.toString()));
    WritableMap params = Arguments.createMap();
    this.sendEvent("onExitRegion", params);
  }

	private void sendEvent(String eventName, @Nullable WritableMap params) {
		mAppContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit("IALocationManager." + eventName, params);
	}

  //IALocationListener methods
	public void onLocationChanged(IALocation location) {
		// handle location change
    WritableMap params = Arguments.createMap();
    this.sendEvent("onLocationChanged", params);
	}

	public void onStatusChanged(String provider, int status, Bundle extras) {
		// handle service status change
    WritableMap params = Arguments.createMap();
    this.sendEvent("onStatusChanged", params);
	}
  
  //@ReactMethod
  //public void createLocationManager(final Promise promise) {
    //Handler mainHandler = new Handler(Looper.getMainLooper());
    //mainHandler.post(new Runnable() {
      //@Override
      //public void run() {
        //lmInstance = IALocationManager.create(appContext);
        //promise.resolve(true);
      //}
    //});
  //}
}
