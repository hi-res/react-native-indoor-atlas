package io.srounce.reactnativeindooratlas;

import android.app.Activity;
import android.content.Intent;
import android.content.Context;
import android.location.Location;
import android.Manifest;
import android.os.Handler;
import android.os.Looper;
import android.support.v4.app.ActivityCompat;

import com.facebook.react.bridge.ActivityEventListener;
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
import android.content.Context;

import com.indooratlas.android.sdk.IALocationManager;

public class IndoorAtlasReactNativePlugin 
  extends ReactContextBaseJavaModule
  implements ActivityEventListener
{
  public static final String TAG = "IndoorAtlasReactNativePlugin";
  public static final int CODE_PERMISSIONS = 1;

  private ReactApplicationContext appContext;
  private HashMap<Integer, IALocationManager> locationManagerRegistry;
  private int locationManagerRefCount = 0;

  public IndoorAtlasReactNativePlugin(ReactApplicationContext appContext) {
    super(appContext);

    String[] neededPermissions = {
      Manifest.permission.CHANGE_WIFI_STATE,
      Manifest.permission.ACCESS_WIFI_STATE,
      Manifest.permission.ACCESS_COARSE_LOCATION
    };

    this.appContext = appContext;
    //Activity activity = (Activity)((Context) appContext);

    //ActivityCompat.requestPermissions(activity, neededPermissions, CODE_PERMISSIONS);
    locationManagerRegistry = new HashMap<Integer, IALocationManager>();
    appContext.addActivityEventListener(this);
  }

  @Override
  public String getName() {
    return TAG;
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {

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
  public void createLocationManager(final Promise promise) {
    Handler mainHandler = new Handler(Looper.getMainLooper());
    mainHandler.post(new Runnable() {
      @Override
      public void run() {
        int index = locationManagerRefCount;
        IALocationManager lm = IALocationManager.create(appContext);
        locationManagerRegistry.put(index, lm);
        promise.resolve(index);
        locationManagerRefCount += 1;
      }
    });
  }
}
