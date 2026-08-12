import type { Equipment, Exercise, MuscleGroup } from '../domain/types'

const CATALOG_VERSION = 1
const createdAt = '2026-08-12T00:00:00.000Z'

function exercise(
  id: string,
  name: string,
  equipment: Equipment,
  primaryMuscle: MuscleGroup,
  instructions: string[],
): Exercise {
  return {
    id,
    name,
    equipment,
    primaryMuscle,
    instructions,
    origin: 'starter',
    archived: false,
    createdAt,
    updatedAt: createdAt,
  }
}

export { CATALOG_VERSION }

export const STARTER_EXERCISES: Exercise[] = [
  exercise('barbell-back-squat', 'Barbell Back Squat', 'Barbell', 'Quadriceps', [
    'Set the bar across your upper back and brace before leaving the rack.',
    'Sit down between your hips while keeping your whole foot connected to the floor.',
    'Drive the floor away and stand tall without letting the knees collapse inward.',
  ]),
  exercise('front-squat', 'Front Squat', 'Barbell', 'Quadriceps', [
    'Rest the bar on the front of the shoulders and lift the elbows.',
    'Brace, descend with an upright torso, and keep pressure through the midfoot.',
    'Stand by driving the knees and hips together.',
  ]),
  exercise('leg-press', 'Leg Press', 'Machine', 'Quadriceps', [
    'Place both feet securely on the platform and keep your hips against the pad.',
    'Lower the platform under control until your comfortable depth.',
    'Press through the full foot without locking the knees forcefully.',
  ]),
  exercise('leg-extension', 'Leg Extension', 'Machine', 'Quadriceps', [
    'Align the machine pivot with your knee and place the pad above the ankle.',
    'Extend the knees until the legs are nearly straight.',
    'Pause briefly, then lower the weight with control.',
  ]),
  exercise('romanian-deadlift', 'Romanian Deadlift', 'Barbell', 'Hamstrings', [
    'Hold the bar close to the thighs with soft knees and a braced trunk.',
    'Push the hips back until the hamstrings are strongly loaded.',
    'Drive the hips forward while keeping the bar close to the body.',
  ]),
  exercise('conventional-deadlift', 'Conventional Deadlift', 'Barbell', 'Back', [
    'Set the midfoot beneath the bar, grip it, and brace with the back held firm.',
    'Push the floor away as the bar travels close to the legs.',
    'Stand tall, then return the bar by moving the hips back first.',
  ]),
  exercise('seated-leg-curl', 'Seated Leg Curl', 'Machine', 'Hamstrings', [
    'Set the knee joint in line with the machine pivot and secure the thigh pad.',
    'Curl the pad down and back without lifting your hips.',
    'Pause in the shortened position and return slowly.',
  ]),
  exercise('barbell-hip-thrust', 'Barbell Hip Thrust', 'Barbell', 'Glutes', [
    'Place the upper back on a stable bench and center the padded bar over the hips.',
    'Brace and drive through the heels until the hips are fully extended.',
    'Lower the hips under control without losing the bar position.',
  ]),
  exercise('bulgarian-split-squat', 'Bulgarian Split Squat', 'Dumbbell', 'Quadriceps', [
    'Place the rear foot on a bench and set the front foot far enough forward for balance.',
    'Lower the rear knee while keeping the front foot planted.',
    'Drive through the front leg to return to standing.',
  ]),
  exercise('walking-lunge', 'Walking Lunge', 'Dumbbell', 'Glutes', [
    'Stand tall with room to step and keep the dumbbells steady at your sides.',
    'Step forward and lower both knees under control.',
    'Push through the front foot and bring the next leg through into the following rep.',
  ]),
  exercise('standing-calf-raise', 'Standing Calf Raise', 'Machine', 'Calves', [
    'Place the balls of the feet on the platform with the heels free to move.',
    'Lower the heels into a comfortable stretch.',
    'Rise as high as possible through the ankles, pause, and lower slowly.',
  ]),
  exercise('barbell-bench-press', 'Barbell Bench Press', 'Barbell', 'Chest', [
    'Set your eyes under the bar, plant the feet, and pull the shoulders into the bench.',
    'Lower the bar to the lower chest with the forearms near vertical.',
    'Press up and slightly back while keeping the upper back tight.',
  ]),
  exercise('incline-dumbbell-press', 'Incline Dumbbell Press', 'Dumbbell', 'Chest', [
    'Set a low incline and begin with the dumbbells above the upper chest.',
    'Lower until the elbows pass the torso comfortably.',
    'Press the dumbbells up while keeping the shoulders anchored.',
  ]),
  exercise('machine-chest-press', 'Machine Chest Press', 'Machine', 'Chest', [
    'Adjust the seat so the handles align with mid-chest.',
    'Press forward without allowing the shoulders to roll toward the ears.',
    'Return until the chest is comfortably stretched.',
  ]),
  exercise('cable-fly', 'Cable Fly', 'Cable', 'Chest', [
    'Take a stable split stance with the handles slightly behind the chest.',
    'Bring the hands together in a wide arc with a soft elbow bend.',
    'Return slowly while keeping the ribcage controlled.',
  ]),
  exercise('push-up', 'Push-Up', 'Bodyweight', 'Chest', [
    'Set the hands just outside shoulder width and form a straight line from head to heels.',
    'Lower the chest between the hands while keeping the elbows controlled.',
    'Push the floor away and finish with the shoulder blades moving naturally.',
  ]),
  exercise('overhead-press', 'Barbell Overhead Press', 'Barbell', 'Shoulders', [
    'Hold the bar at the upper chest, brace, and squeeze the glutes.',
    'Move the head back slightly and press the bar in a vertical path.',
    'Finish overhead with the ribs controlled, then lower to the start.',
  ]),
  exercise('seated-dumbbell-press', 'Seated Dumbbell Press', 'Dumbbell', 'Shoulders', [
    'Sit firmly against the backrest with the dumbbells beside the shoulders.',
    'Press overhead without arching away from the pad.',
    'Lower until the elbows reach a comfortable depth.',
  ]),
  exercise('dumbbell-lateral-raise', 'Dumbbell Lateral Raise', 'Dumbbell', 'Shoulders', [
    'Stand tall with the dumbbells at your sides and elbows softly bent.',
    'Raise the arms out and slightly forward until near shoulder height.',
    'Lower slowly without swinging the torso.',
  ]),
  exercise('reverse-pec-deck', 'Reverse Pec Deck', 'Machine', 'Shoulders', [
    'Set the handles so the arms begin slightly in front of the shoulders.',
    'Open the arms by moving through the rear shoulders rather than the lower back.',
    'Return under control without letting the stack rest.',
  ]),
  exercise('pull-up', 'Pull-Up', 'Bodyweight', 'Back', [
    'Hang from the bar with the shoulders active and the body steady.',
    'Drive the elbows down until the chin clears the bar.',
    'Lower to full arm length without losing control.',
  ]),
  exercise('lat-pulldown', 'Lat Pulldown', 'Cable', 'Back', [
    'Secure the thighs and take a grip that lets the forearms track vertically.',
    'Pull the bar toward the upper chest by driving the elbows down.',
    'Return to long arms while keeping the torso steady.',
  ]),
  exercise('barbell-row', 'Barbell Row', 'Barbell', 'Back', [
    'Hinge to a stable torso angle and brace with the bar hanging below the shoulders.',
    'Row the bar toward the lower ribs without jerking the hips.',
    'Lower until the arms are long while maintaining the hinge.',
  ]),
  exercise('seated-cable-row', 'Seated Cable Row', 'Cable', 'Back', [
    'Sit tall with a slight knee bend and reach without rounding excessively.',
    'Pull the handle toward the lower ribs and bring the shoulder blades back.',
    'Extend the arms under control while keeping the torso quiet.',
  ]),
  exercise('chest-supported-row', 'Chest-Supported Row', 'Dumbbell', 'Back', [
    'Lie against an incline bench with the dumbbells hanging freely.',
    'Row toward the hips while keeping the chest on the pad.',
    'Lower to a full stretch without shrugging.',
  ]),
  exercise('single-arm-dumbbell-row', 'Single-Arm Dumbbell Row', 'Dumbbell', 'Back', [
    'Support the free hand and set a stable hip hinge.',
    'Pull the dumbbell toward the hip with the shoulder away from the ear.',
    'Lower until the arm is long without rotating the torso.',
  ]),
  exercise('barbell-curl', 'Barbell Curl', 'Barbell', 'Biceps', [
    'Stand tall with the bar at arm length and the elbows near the ribs.',
    'Curl without driving the elbows forward or swinging the torso.',
    'Squeeze briefly and lower to full elbow extension.',
  ]),
  exercise('incline-dumbbell-curl', 'Incline Dumbbell Curl', 'Dumbbell', 'Biceps', [
    'Lean against an incline bench with the arms hanging behind the torso.',
    'Curl while keeping the upper arms still.',
    'Lower fully and avoid rolling the shoulders forward.',
  ]),
  exercise('hammer-curl', 'Hammer Curl', 'Dumbbell', 'Biceps', [
    'Hold the dumbbells with the palms facing inward.',
    'Curl while keeping the wrists neutral and elbows close.',
    'Lower under control to straight arms.',
  ]),
  exercise('cable-curl', 'Cable Curl', 'Cable', 'Biceps', [
    'Stand far enough from the stack to keep tension at the bottom.',
    'Curl the handle without moving the upper arms.',
    'Return slowly until the elbows are straight.',
  ]),
  exercise('triceps-pushdown', 'Triceps Pushdown', 'Cable', 'Triceps', [
    'Pin the elbows near the ribs with the forearms above parallel.',
    'Extend the elbows until the arms are straight.',
    'Return the handle without letting the elbows drift forward.',
  ]),
  exercise('overhead-triceps-extension', 'Overhead Triceps Extension', 'Cable', 'Triceps', [
    'Face away from the cable and set the elbows beside the head.',
    'Extend the arms while keeping the upper arms fixed.',
    'Bend the elbows into a comfortable stretch and repeat.',
  ]),
  exercise('close-grip-bench-press', 'Close-Grip Bench Press', 'Barbell', 'Triceps', [
    'Use a shoulder-width grip and set the upper back firmly on the bench.',
    'Lower the bar with the elbows tracking close to the torso.',
    'Press to straight arms without losing the shoulder position.',
  ]),
  exercise('plank', 'Forearm Plank', 'Bodyweight', 'Core', [
    'Place the elbows beneath the shoulders and extend both legs.',
    'Brace the trunk and squeeze the glutes to form one straight line.',
    'Maintain quiet breathing without letting the hips rise or sag.',
  ]),
  exercise('hanging-knee-raise', 'Hanging Knee Raise', 'Bodyweight', 'Core', [
    'Hang with the shoulders active and legs still.',
    'Curl the pelvis and bring the knees toward the chest.',
    'Lower slowly without swinging into the next repetition.',
  ]),
  exercise('cable-crunch', 'Cable Crunch', 'Cable', 'Core', [
    'Kneel with the cable held beside the head and hips kept steady.',
    'Bring the ribs toward the pelvis by flexing the trunk.',
    'Return under control without pulling with the arms.',
  ]),
]
