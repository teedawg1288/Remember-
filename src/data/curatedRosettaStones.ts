import type { LivingRosettaStone, SameStoryResult } from '../types/sameStory';
import { CURATED_STORIES } from './curatedStories';

// These two offline examples predate the Rosetta Stone feature.
// Their translations are explicitly hypothetical, not claims about a real child
// or what individual group members were thinking.
const CURATED_ROSETTA: Record<string, LivingRosettaStone> = {
  'parent-giving-in': {
    primaryChord: 'Responsibility',
    secondaryChords: ['Conflict', 'Growth', 'Change'],
    oneQuestionThatChangesEverything: {
      question: 'Is the parent trying to stop the noise now, while the child may be learning what changes the answer next time?',
      whyItShiftsTheLens: 'Two time horizons can coexist: immediate relief for the parent and a possible longer-term learning pattern for the child. Neither motive can be read directly from a tantrum.',
    },
    translations: [{
      speakerA: {
        role: 'Parent setting a boundary',
        said: 'No candy today — then bought candy after the child screamed.',
        meant: 'A possible intention was to hold the boundary, followed by a choice to end a difficult public moment.',
        hiddenNeedOrEmotion: 'The parent might need quiet, safety, time, or relief from public pressure; ask instead of assuming.',
      },
      speakerB: {
        role: 'Child receiving mixed signals',
        heard: 'No candy — then the answer changed after screaming.',
        understoodMeaning: 'One possible learned connection is that a louder or longer protest can change the outcome. We cannot know the child’s private understanding from this example alone.',
        isConfirmedInterpretation: false,
        felt: 'The child may have been frustrated, overwhelmed, tired, or simply eager for candy.',
        reactionTriggered: 'In the example, screaming is repeated on later visits. Its cause still needs checking each time.',
        consequenceOfReaction: 'The family can become stuck between immediate peace and predictable boundaries.',
      },
      meaningShiftPoint: 'The spoken limit (“no”) and the final action (buying candy) sent different signals.',
      whereTranslationFailed: 'The parent may interpret giving in as temporary relief; the child may experience it as a changed rule.',
      theBridge: 'Before the next shopping trip, explain the plan simply, account for age and needs, and respond calmly and consistently. Check hunger, overload, and other possible causes before calling every upset a tactic.',
      crossFieldTranslation: {
        scientificConcept: 'Reinforcement and feedback loops',
        everydayExperience: 'When pressing a button sometimes produces a reward, someone may try pressing it again; human behaviour also depends on needs and context.',
      },
    }],
    lifeLenses: [{
      stageId: 'starting_out',
      stageTitle: 'Learning the Boundary',
      tagline: 'What does “no” mean when the result changes?',
      howItAppearsHere: 'From the child’s position, words and consequences may not line up, but the child’s actual understanding is unknown.',
      whatYouCouldNotSeeThen: 'What looks like “winning” may also involve tiredness, overload, or limited ability to regulate frustration.',
      theSongMetaphor: 'Hearing the same chorus with a different ending each time.',
    }, {
      stageId: 'heavy_lifting',
      stageTitle: 'Carrying Responsibility',
      tagline: 'The adult sees the clock, the crowd, and the longer-term lesson.',
      howItAppearsHere: 'The parent may weigh getting through checkout against helping the child learn a predictable rule.',
      whatYouCouldNotSeeThen: 'A public meltdown does not reveal why the child is upset or prove the parent is weak.',
      theSongMetaphor: 'Trying to keep tempo while two different songs play at once.',
    }, {
      stageId: 'looking_back',
      stageTitle: 'Updating the Lesson',
      tagline: 'Judge the next event using what is known now.',
      howItAppearsHere: 'With more information, a parent can change their response without branding the child permanently “difficult.”',
      whatYouCouldNotSeeThen: 'The same visible screaming may have a different cause on a different day.',
      theSongMetaphor: 'Replaying an old song and hearing the part you missed before.',
    }],
    vignetteCreation: {
      title: 'The Checkout Line',
      type: 'micro_story',
      text: 'A parent says no. The child protests. The parent buys the candy and the aisle gets quiet. Next week the child protests again. The question is not who is the villain; it is what each person learned — and what else could explain the next outburst.',
      sensoryImage: 'Bright checkout lights, a rustling candy wrapper, and a suddenly quiet shopping cart.',
    },
  },
  'bystander-freeze': {
    primaryChord: 'Responsibility',
    secondaryChords: ['Belonging', 'Conflict', 'Growth'],
    oneQuestionThatChangesEverything: {
      question: 'Did “someone needs to handle this” tell anyone that the responsibility was actually theirs?',
      whyItShiftsTheLens: 'A message can reach twenty people without creating a clear owner, deadline, or agreement.',
    },
    translations: [{
      speakerA: {
        role: 'Person announcing the problem',
        said: 'There is a major problem. Someone needs to fix it.',
        meant: 'A possible intention was to make the group aware and get action started.',
        hiddenNeedOrEmotion: 'They may need help or a reliable decision; their urgency is not a confirmed fact until checked.',
      },
      speakerB: {
        role: 'Group member hearing the announcement',
        heard: 'Everyone was told about the problem.',
        understoodMeaning: 'A member may think a leader or someone with the right skills will take over; another may think they were personally being asked. Neither interpretation is confirmed.',
        isConfirmedInterpretation: false,
        felt: 'Possible uncertainty about role, competence, authority, or whether another person has already acted.',
        reactionTriggered: 'In the example, nobody takes ownership despite many people seeing the announcement.',
        consequenceOfReaction: 'The unresolved issue can become larger while people wait.',
      },
      meaningShiftPoint: '“Everybody knows” was treated as if it meant “somebody has accepted responsibility.”',
      whereTranslationFailed: 'Awareness did not get translated into an assigned action, owner, or confirmation.',
      theBridge: 'Name a specific owner, next action, deadline, and backup. Ask the person to confirm what they understood and whether they have the resources to act.',
      crossFieldTranslation: {
        scientificConcept: 'Task assignment and acknowledgement in distributed systems',
        everydayExperience: 'A job left on the group chat is not the same thing as someone replying “I have it.”',
      },
    }],
    lifeLenses: [{
      stageId: 'starting_out',
      stageTitle: 'New to the Group',
      tagline: 'Who is allowed to act?',
      howItAppearsHere: 'A newcomer might wait for instructions, unclear about whether acting would overstep.',
      whatYouCouldNotSeeThen: 'Silence can mean confusion, not indifference.',
      theSongMetaphor: 'An orchestra warming up with no one yet giving the downbeat.',
    }, {
      stageId: 'heavy_lifting',
      stageTitle: 'Carrying the Task',
      tagline: 'Awareness is not an assignment.',
      howItAppearsHere: 'A responsible person tries to identify the owner, real resources, and what “done” would mean.',
      whatYouCouldNotSeeThen: 'A title alone cannot guarantee availability, competence, or permission.',
      theSongMetaphor: 'Everyone hears the rhythm, but nobody knows who starts the verse.',
    }, {
      stageId: 'looking_back',
      stageTitle: 'Redesigning the Handoff',
      tagline: 'Fix the handoff instead of blaming every bystander.',
      howItAppearsHere: 'The group can make future requests explicit and check whether the system changed.',
      whatYouCouldNotSeeThen: 'The next missed task might have a new cause and needs fresh evidence.',
      theSongMetaphor: 'A band finally agrees who counts in the next song.',
    }],
    vignetteCreation: {
      title: 'Twenty People Saw It',
      type: 'micro_story',
      text: 'A message flashes across twenty screens. Everyone reads it. By evening the problem is still there. When someone finally asks who accepted the job, the room goes quiet: being informed was never the same as agreeing to act.',
      sensoryImage: 'Twenty little notification lights, not one confirmed handoff.',
    },
  },
};

/**
 * Only use an authored offline translation for its exact original demo prompt.
 * A live analysis or user-edited situation must never inherit another story's text.
 */
export function getRosettaStoneForAnalysis(analysis: SameStoryResult): LivingRosettaStone | undefined {
  if (analysis.rosettaStone) return analysis.rosettaStone;
  const originalDemo = CURATED_STORIES.find((story) =>
    story.id === analysis.id && story.userOriginalInput === analysis.userOriginalInput
  );
  return originalDemo ? CURATED_ROSETTA[analysis.id] : undefined;
}
