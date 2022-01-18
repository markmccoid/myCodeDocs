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

