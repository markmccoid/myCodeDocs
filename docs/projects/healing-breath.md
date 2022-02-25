---
id: healing-breath
title: Healing Breath
sidebar_label: Healing Breath
---

iOS application giving the user full control over a Wif Hof style breathing session.

The brains of the application is in a Finite State Machine, defined using the XState JavaScript library.

## breathMachine.ts - Finite State Machine

The breath machine is very customizable, allowing a perfect session based on the users needs.

A typical Wim Hof breathing **Session** will consist of multiple **Rounds** and each **Round** will consist of the following:

1.  **Conscious Forced Breathing** - Consistent inhales and exhales, usually in the 30-40 breath range, with a breath being the combination of an inhale and exhale.
2. **Breath Retention** - On the final exhale from step 1, you will hold your breath for as long as you can.  This will vary on the person and usually will increase as you do multiple rounds.
3. **Recovery Breath** - Once you have held your breath for as long as you could in step 2, you will take a deep breath and hold it for a recovery period.  Usually 15 seconds.

The above three steps constitute a single **Round**.  A typical breathing **Session** will consist of three to five of the above **Rounds**.

The following inputs allow you to full customize your rounds and session.

> NOTE: All inputs/times are in **milliseconds**.  Simply multiply your seconds by 1000.
>
> The default interval is 100 milliseconds, so there is no reason to add any more precision to your seconds.  I.E. 1.4, 10.5, that is the precision (tenths of a second).

### Setting Times for Breath Lengths

- **inhaleTime** - (Step 1 above) Length of inhale.  1.2 Seconds is fast, 1.6 or 1.7 is medium.
- **pauseTime** - (Step 1 above) Not needed in Wim Hof, but this would be a hold after each Inhale before the Exhale.  Just don't update this value or set it to zero to ignore.
- **exhaleTime** - (Step 1 above) Lenght of exhale. 1.2 Seconds is fast, 1.6 or 1.7 is medium.
- **defaultHoldTime** - (Step 2 above) Since you will have multiple rounds in a session, the defaultHoldTime will be the **Breath Retention** time for any round that isn't explicity defined.  We will see how to set the individual round hold times in the code sample.
- **actionPauseTimeIn** - This is a unit of time that will take place before the Recovery Hold Time starts.  This allows the user to inhale and begin the recovery hold.  2-3 seconds is good.
- **recoveryHoldTime** - (Step 3 above) Recovery breath hold time.  
- **actionPauseTimeOut** - This is a unit of time that will take place **AFTER** the Recovery Hold Time ends.  This allows the user to exhale and prepare for the next round to begin.  5-6 seconds is good.

### Configuring Rounds and Session

The timings above constitute most of the setup, however, we do need to be able to set how many Forced Breaths are to be taken and how many breath rounds will be in the session.

- **breathReps** - How many Conscious Forced Breaths to take before breath retention hold.  Usually between 30 and 40 breaths.
- **breathRounds** - How many rounds (Steps 1 - 3 above) will be included in the session.  Usually 3-4.

### Code to Update Machine Settings

The code needed to update the above machine settings have been encapsulated in the `useBreathEvents` hook located in the `\hooks\useBreathMachineHooks.ts` file.

```javascript
// breathEvents will be an object with many relevant events
const breathEvents = useBreathEvents();

// There are 2 events for updating the machine defaults:
breathEvents.updateSessionSettings({ inhaleTime: 1700, exhaleTime: 1700, ...}, true)
breathEvents.updateSessionBreathRounds({ 1: { holdTime: 30000 }, 2: { holdTime: 30000}, ... })
```

Note that for the `updateSessionSettings` function, you can pass two parameters, the first being the settings config object and the second a boolean indicating whether to clear the **sessionStats** and reset the **sessionComplete** flag.

Usualy when setting the sessions settings, you will want to do this, so if not passed the default is true.

> While there is a separate function to update the Breath Rounds, you could just as easily update them using the `updateSessionSettings` function, simply add the following:
>
> { inhaleTime: 1700, **breathRoundsDetail: { 1: { holdTime: 10000 }, ...}** }

## Alerts

Alerts are configurable items that allow the user to tell the session to "alert" the user of an event.  In the  case of this application we have a predetermined set of **Alert Events** that are configurable.

The alerts can be either a **sound** or **UI** alert or **both**.  

The `alertListener.ts` file contains the code for all the alerts.  It is imported into the `breathMachineContext.tsx` file so that the **UI** alerts can be used by any component that wants them.  The **Sound** alerts are handled() within the `alertListener.ts` file.

Below are the predetermined alerts, which are set via and object that is passed along with the session settings.

**Conscious Forced Breathing Alerts (breathing)**

- **alertEveryXBreaths** *(breathing.everyXBreaths)* - set an alert that will trigger after every X breaths.
- **alertXBreathsBeforeEnd** *(breathing.breathsBeforeEnd)* - set an alert that will trigger X breaths before the end of Conscious Forced Breathing.  If set to 5 and you are doing 30 breaths, this will trigger on the 25th breath.

 **Breath Retention Alerts (holding)**

- **alertEveryXSeconds** *(retention.everyXSeconds)* - set an alert that will trigger after every X seconds. To hear a sound every minute, this would be set to 60.
- **alertXSecondsBeforeEnd** *(retention.secondsBeforeEnd)* - set an alert that will trigger X seconds before the end of Breath Retention.  If set to 5 and retention is for 2 minutes, alert would trigger at 1:55 minutes.

**Recovery Breath Alerts (recoveryhold)**

- **alertEveryXSeconds** *(recovery.everyXSeconds)* - set an alert that will trigger after every X seconds. This may not be used much, as default recovery time is 15 seconds.
- **alertXSecondsBeforeEnd** *(recovery.secondsBeforeEnd)* - set an alert that will trigger X seconds before the end of the **Recovery Breath** .  If set to 5 and recovery is for 15 minutes, alert would trigger at 10 seconds.
- **alertBreathInPause** - set an alert that triggers when the `intropause` state is started in the breathMahcine.  It will only allow for the setting of a sound asset to be played or nothing.
- **alertBreathOutPause** - set an alert that triggers when the `outropause` state is started in the breathMahcine.  It will only allow for the setting of a sound asset to be played or nothing.

**Alert Object to Set Above** - `utils/alertTypes.ts`

```javascript
type AlertSettings = {
  ConsciousForcedBreathing: {
    alertEveryXBreaths: {
      value: number;
      sound: AlertSoundNames;
    };
    alertXBreathsBeforeEnd: {
      value: number;
      sound: AlertSoundNames;
      countDown: boolean;
      countDownSound: AlertSoundNames;
    };
  };
  BreathRetention: {
    alertEveryXSeconds: {
      value: number;
      sound: AlertSoundNames;
    };
    alertXSecondsBeforeEnd: {
      value: number;
      sound: AlertSoundNames;
      countDown: boolean;
      countDownSound: AlertSoundNames;
    };
  };
  RecoveryBreath: {
    alertBreathInPause: {
      sound: AlertSoundNames;
    };
    alertEveryXSeconds: {
      value: number;
      sound: AlertSoundNames;
    };
    alertXSecondsBeforeEnd: {
      value: number;
      sound: AlertSoundNames;
      countDown: boolean;
      countDownSound: AlertSoundNames;
    };
    alertBreathOutPause: {
      sound: AlertSoundNames;
    };
  };
};
```

### Alert Object and Hooks

The object that holds the alert information is as follows. 

Note that there alert structure is the same for all alerts, except if it is a "breathing" alert, there will be a `breath` key and if it is a "retention" or "recovery" alert, there will be a `elapsed` key.

```javascript
type BreathAlertNames = "breathing.everyXBreaths" | "breathing.breathsBeforeEnd";
type SecondsAlertNames =
  | "retention.everyXSeconds"
  | "retention.secondsBeforeEnd"
  | "recovery.everyXSeconds"
  | "recovery.secondsBeforeEnd";

export type Alert<T = SecondsAlertNames | BreathAlertNames> = {
  type: T;
  alertSound: AlertSoundNames;
  // breath number that triggered alert
  breath?: number;
  // elapsed seconds that triggered alert (milliseconds)
  elapsed?: number;
};
export type BreathAlert = Omit<Alert<BreathAlertNames>, "elapsed"> | undefined;
export type SecondsAlert = Omit<Alert<SecondsAlertNames>, "breath"> | undefined;
```

**Hooks**

You can access an triggered alerts through a couple of different hooks.  If you are using the `useBreathMachineInfo` hook, it return an **alert** object.

But you may want to just get alerts that were triggered for Breathing, Retention or Recovery events.  For these, you can use the following hooks:

```javascript
const breathAlert = useBreathAlert();
// breath alert shape:
// {
//   type: "breathing.everyXBreaths"|"breathing.breathsBeforeEnd"
//   alertSound: AlertSoundNames;
//   breath: number
// }

const retentionAlert = useRetentionAlert();
// retention alert shape:
// {
//   type: "retention.everyXSeconds"|"retention.secondsBeforeEnd"
//   alertSound: AlertSoundNames;
//   seconds: number
// }

const recoveryAlert = useRecoveryAlert();
// recovery alert shape:
// {
//   type: "recovery.everyXSeconds"|"recovery.secondsBeforeEnd"
//   alertSound: AlertSoundNames;
//   seconds: number
// }

```



### TO DO

Need to determine what good defaults should be, maybe NONE!  If not set up, then most get no defaults.  Maybe just the following:

- **ConsciousForcedBreathing.alertEveryXBreaths** = 10
- **ConsciousForcedBreathing.alertXBreathsBeforeEnd** = 2
- **BreathRetention.alertXSecondsBeforeEnd** = 5
- **RecoveryBreath.alertBreathInPause** = some sound
- **RecoveryBreath.alertXSecondsBeforeEnd** = 5
- **RecoveryBreath.alertBreathOutPause** = some sound

Need to also make sure anytime seconds is passed, we multiply by 1000, since our timer ticks by milliseconds.

How to structure text alerts to UI.  Probably need typed return values for every type of alert.  Maybe we don't need to know how may seconds, but simply that a certain type of alert was triggered.  OR, intead of a string, the payload could be a string and a value.

```javascript

```



### Alert Sounds

Sound script files are located in `\utils\sounds\`. There is a `soundTypes.ts`file which has an `AlertSoundNames` , `AlertPlayableSounds` and  `AlertSounds` type.  The `AlertSoundName` type will contain all the possible alert sound names that are loaded into an object with the type of `AlertSounds`, which will be an Expo Asset type.  

```typescript
import { Audio } from "expo-av";
import { Asset } from "expo-asset";

export type AlertSoundNames =
  | "tick"
  | "ding"
  | "gong"
  | "churchBell"
  | "breathInMark"
  | "breathOutMark"
  | "airplaneDing"
  | "elevatorDing";

export type AlertSounds = {
  [assetName in AlertSoundNames]: Asset;
};

export type AlertPlayableSounds = {
  [assetName in AlertSoundNames]: Audio.Sound;
};

```

This means, that whenever you add a new sound that is loaded.  You will need to update the AlertSoundNames type.

The `AlertSounds` type defines the object that holds all of the sounds that are loaded via a `require` statement.

The `AlertPlayableSounds` type is defining the object that hold the actual playable alert sound.

The load of the assets looks like this:

**SoundLibrary.ts**

```typescript
// Global variable holding the Audio.Sound object (playable sounds)
let alertPlayableSounds: AlertPlayableSounds;

// Global variable holding the sounds
export const alertSounds: AlertSounds = {
  gong: require("../../../assets/sounds/gong01.wav"),
  churchBell: require("../../../assets/sounds/ChurchBell001.mp3"),
  breathInMark: require("../../../assets/sounds/BreathInMark.mp3"),
  breathOutMark: require("../../../assets/sounds/BreathOutMark.mp3"),
  airplaneDing: require("../../../assets/sounds/AirplaneDing.mp3"),
  elevatorDing: require("../../../assets/sounds/ElevatorDing.mp3"),
};

//We also need to load the above into an object for playback:
// This is called when app is started.
export const loadSounds = async () => {
  // Loads all alertSounds to the global object:
  //-- alertPlayableSounds
  await Promise.all(
    Object.keys(alertSounds).map((key) => {
      const assetName = key as AssetNames;
      alertPlayableSounds = { ...alertPlayableSounds, [assetName]: new Audio.Sound() };
      // alertPlayableSounds[assetName] = new Audio.Sound();
      return alertPlayableSounds[assetName].loadAsync(alertSounds[assetName]);
    })
  );
};

// Could call loadSounds from App.tsx, but using a hook is similar to how
// expo loads fonts
export const useLoadSounds = () => {
  const [soundsLoaded, setSoundsLoaded] = React.useState(false);
  React.useEffect(() => {
    const effectLoadSounds = async () => {
      await loadSounds();
      setSoundsLoaded(true);
    };
    effectLoadSounds();
  }, []);
  return [soundsLoaded];
};

//Lastly we need a global function that can be called with an asset name
//that will play that sound:
// Will play the passed asset names sound
export const playSound = async (name: AssetNames) => {
  console.log(`plaing sound --> ${name}`);
  try {
    if (alertPlayableSounds[name]) {
      await alertPlayableSounds[name].replayAsync();
    }
  } catch (error) {
    console.warn(error);
  }
};
```

The above code will be accessed in the `App.tsx` component.

```jsx
export default function App() {
  let [soundsLoaded] = useLoadSounds();
  let [fontsLoaded] = useFonts({
    FiraSans_500Medium,
  });
  if (!fontsLoaded || !soundsLoaded) {
    return (
      <AppLoading />
    );
  }
  return (
  ...
  )
  ...
}
```

## Global Storage

Using **Zustand** as a global store.  Currently using a package called *persist* to store data to Async storage.  

I probably need to write my own, or see if persiste allows a loader to run when pulling data from storage to make sure if it is valid.

OR, just make sure my CreateNewSession function doesn't let bad data through.
