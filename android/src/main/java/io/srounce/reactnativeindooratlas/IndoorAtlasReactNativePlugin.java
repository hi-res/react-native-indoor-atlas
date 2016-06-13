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
import com.facebook.react.bridge.LifecycleEventListener;
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

import static java.lang.Math.*;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.lang.Long;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.Nullable;

import android.content.Context;

import com.indooratlas.android.sdk.*;
import com.indooratlas.android.sdk.resources.*;

public class IndoorAtlasReactNativePlugin 
  extends ReactContextBaseJavaModule
  implements ActivityEventListener, LifecycleEventListener, IALocationListener, IARegion.Listener
{
  public static final String TAG = "RNIA";
  public static final int CODE_PERMISSIONS = 1;

  private Activity mActivity;
  private ReactApplicationContext mAppContext;
  private IALocationManager mLocationManager;
	private IAResourceManager mResourceManager;

  public IndoorAtlasReactNativePlugin(
      final ReactApplicationContext context,
      final Activity activity
  ) {
    super(context);

    mActivity = activity;
    mAppContext = context;
    mAppContext.addActivityEventListener(this);
    mAppContext.addLifecycleEventListener(this);

    final IndoorAtlasReactNativePlugin self = this;
    Handler mainHandler = new Handler(Looper.getMainLooper());
    mainHandler.post(new Runnable() {
      @Override
      public void run() {
        mLocationManager = IALocationManager.create(context);
        mResourceManager = IAResourceManager.create(context);
      }
    });
  }

  @Override
  public void onHostResume() {
    final IndoorAtlasReactNativePlugin self = this;

    Log.d(TAG, String.format("onResume"));

    WritableMap params = Arguments.createMap();
    this.sendEvent("test", params);

    Handler mainHandler = new Handler(Looper.getMainLooper());
    mainHandler.post(new Runnable() {
      @Override
      public void run() {
        Boolean result = mLocationManager.requestLocationUpdates(IALocationRequest.create(), self);
        Log.d(TAG, String.format("Registered for events: %b", result));

        mLocationManager.registerRegionListener(self);
      }
    });
  }

  @Override
  public void onHostPause() {
    final IndoorAtlasReactNativePlugin self = this;

    Log.d(TAG, String.format("onPause"));

    Handler mainHandler = new Handler(Looper.getMainLooper());
    mainHandler.post(new Runnable() {
      @Override
      public void run() {
        mLocationManager.unregisterRegionListener(self);
      }
    });
  }

  @Override
  public void onHostDestroy() {
    mLocationManager.destroy();
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
    Log.d(TAG, String.format("requestCode: %d\n resultCode: %d\n", requestCode, resultCode));
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
    params.putMap("region", this.serializeRegion(region));
    this.sendEvent("onEnterRegion", params);
  }

  @Override
  public void onExitRegion(IARegion region) {
    Log.d("RNIA", String.format("onExitRegion %s", region.toString()));
    WritableMap params = Arguments.createMap();
    params.putMap("region", this.serializeRegion(region));
    this.sendEvent("onExitRegion", params);
  }

	private void sendEvent(String eventName, @Nullable Object params) {
		mAppContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(String.format("%s.%s", TAG, eventName), params);
	}

  //IALocationListener methods
	public void onLocationChanged(IALocation location) {
		// handle location change
    Log.d("RNIA", String.format("onLocationChanged %s", location.toString()));
    WritableMap params = Arguments.createMap();
    params.putMap("location", this.serializeLocation(location));
    this.sendEvent("onLocationChanged", params);
	}

	public void onStatusChanged(String provider, int status, Bundle extras) {
		// handle service status change
    WritableMap params = Arguments.createMap();
    //this.sendEvent("onStatusChanged", params);

    switch (status) {
			case IALocationManager.STATUS_CALIBRATION_CHANGED:
				String quality = "unknown";
				switch (extras.getInt("quality")) {
					case IALocationManager.CALIBRATION_POOR:
						quality = "Poor";
						break;
					case IALocationManager.CALIBRATION_GOOD:
						quality = "Good";
						break;
					case IALocationManager.CALIBRATION_EXCELLENT:
						quality = "Excellent";
						break;
				}
				Log.d(TAG, String.format("Calibration change. Quality: %s", quality));
        params.putString("quality", quality);
        this.sendEvent("onCalibrationChanged", params);
				break;
			case IALocationManager.STATUS_AVAILABLE:
				Log.d(TAG, "onStatusChanged: Available");
        params.putString("status", "STATUS_AVAILABLE");
        this.sendEvent("onStatusChanged", params);
				break;
			case IALocationManager.STATUS_LIMITED:
				Log.d(TAG, "onStatusChanged: Limited");
        params.putString("status", "STATUS_LIMITED");
        this.sendEvent("onStatusChanged", params);
				break;
			case IALocationManager.STATUS_OUT_OF_SERVICE:
				Log.d(TAG, "onStatusChanged: Out of service");
        params.putString("status", "STATUS_OUT_OF_SERVICE");
        this.sendEvent("onStatusChanged", params);
				break;
			case IALocationManager.STATUS_TEMPORARILY_UNAVAILABLE:
				Log.d(TAG, "onStatusChanged: Temporarily unavailable");
        params.putString("status", "STATUS_TEMPORARILY_UNAVAILABLE");
        this.sendEvent("onStatusChanged", params);
		}

	}

  private WritableMap serializeLocation(IALocation location) {
    WritableMap serialized = Arguments.createMap();

    serialized.putDouble("latitude", location.getLatitude());
    serialized.putDouble("longitude", location.getLongitude());
    serialized.putDouble("altitude", location.getAltitude());
    serialized.putDouble("bearing", (double) location.getBearing());
    serialized.putDouble("accuracy", (double) location.getAccuracy());
    serialized.putMap("region", this.serializeRegion(location.getRegion()));
    serialized.putInt("timestamp", new Long(location.getTime()).intValue());
    serialized.putBoolean("hasFloorLevel", location.hasFloorLevel());
    serialized.putInt("floorLevel", location.getFloorLevel());

    return serialized;
  }

  private WritableMap serializeRegion(IARegion region) {
    WritableMap serialized = Arguments.createMap();

    serialized.putString("id", region.getId());
    serialized.putInt("timestamp", new Long(region.getTimestamp()).intValue());
    serialized.putInt("type", region.getType());

    return serialized;
  }

//private void fetchFloorPlan(String id) {
//  // Cancel pending operation, if any
//  if (mPendingAsyncResult != null && !mPendingAsyncResult.isCancelled()) {
//    mPendingAsyncResult.cancel();
//  }

//  mPendingAsyncResult = mResourceManager.fetchFloorPlanWithId(id);
//  if (mPendingAsyncResult != null) {
//    mPendingAsyncResult.setCallback(new IAResultCallback<IAFloorPlan>() {
//      @Override
//      public void onResult(IAResult<IAFloorPlan> result) {
//        Logger.d(TAG, "onResult: %s", result);

//        if (result.isSuccess()) {
//          handleFloorPlanChange(result.getResult());
//        } else {
//           do something with error
//          Toast.makeText(FloorPlanManagerActivity.this,
//            "loading floor plan failed: " + result.getError(), Toast.LENGTH_LONG)
//            .show();
//        }
//      }
//    }, Looper.getMainLooper());  deliver callbacks in main thread
//  }
//}
  
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
