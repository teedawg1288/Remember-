import type { EraProjection } from '../types/sameStory.ts';

export function buildErasForDilemma(
  userInput: string,
  summary: string = '',
  underneath: string = ''
): EraProjection[] {
  const text = `${userInput} ${summary} ${underneath}`.toLowerCase();

  // 1. Silent treatment / unreturned greeting / walking past / ignoring text / perceived snub
  const isSilenceOrGreeting =
    text.includes('walk') ||
    text.includes('hello') ||
    text.includes('ignore') ||
    text.includes('text') ||
    text.includes('reply') ||
    text.includes('ghost') ||
    text.includes('silent') ||
    text.includes('nod') ||
    text.includes('snub') ||
    text.includes('past me') ||
    text.includes('wave') ||
    text.includes('message');

  // 2. Chores / unappreciated work / burden / housework / kitchen
  const isChoresOrBurnout =
    text.includes('housework') ||
    text.includes('chore') ||
    text.includes('clean') ||
    text.includes('dishes') ||
    text.includes('burnout') ||
    text.includes('sink') ||
    text.includes('laundry') ||
    text.includes('exhaust');

  // 3. Child giving in / tantrums / discipline / boundaries / candy
  const isParentingOrBoundary =
    text.includes('child') ||
    text.includes('tantrum') ||
    text.includes('give in') ||
    text.includes('giving in') ||
    text.includes('parent') ||
    text.includes('candy') ||
    text.includes('boundary') ||
    text.includes('spoiled');

  if (isSilenceOrGreeting) {
    return [
      {
        id: 'era-bronze-age',
        year: '1200 BCE',
        label: 'Bronze Age (~1200 BCE)',
        setting: 'Mycenaean Palace Cistern & Stone Courtyard',
        technology: 'Sunbaked clay tablets, bronze sickles, donkey pack-trains, oil lamps',
        costume: 'Coarse woven linen tunics, calfskin sandals, hammered bronze armbands',
        howTheDilemmaAppeared:
          'A bronze-caster walks past a clan neighbor by the town cistern with his eyes fixed on the flagstones, without offering the customary hand-to-chest blessing. The neighbor assumes an intentional clan insult, retreats to his household, and tells his brothers to shun the smith at tomorrow’s olive press.',
        whatTheyAssumed: '"He intentionally withheld the blessing. He considers my lineage lesser."',
        whatActuallyHappened:
          'The smith had spent six hours over a smoking copper furnace; the charcoal sparks had left him half-blinded in the midday glare and completely unaware anyone passed by.',
        quote: '"The olive tree remembers the drought, but foolish men remember insults that never happened."',
        visualAtmosphere: {
          artStyle: 'Ancient Mediterranean terracotta fresco with cracked lime plaster',
          lighting: 'Low golden-hour sunset casting long stark shadows across dusty limestone flags',
          colorPalette: ['#78350f', '#d97706', '#fde68a'],
          sceneryDetail: 'Carved stone wellhead, clay amphorae leaning on limestone walls, dusty Aegean hills under an amber sky',
          sensoryDetail: 'Smell of dry thyme, burning olive wood, and heated copper forge',
          sceneSvgType: 'bronze_age',
        },
      },
      {
        id: 'era-classical-antiquity',
        year: '400 BCE',
        label: 'Classical Antiquity (~400 BCE)',
        setting: 'The Painted Stoa & Agora of Athens',
        technology: 'Wax tablets, bronze styluses, olive oil lamps, silver drachmas',
        costume: 'Bleached woolen himations, leather thong sandals, carved signet rings',
        howTheDilemmaAppeared:
          'A citizen walking beneath the marble portico of the Painted Stoa passes a fellow juror without lifting his hand in greeting. The snubbed friend assumes a factional betrayal ahead of tomorrow’s Assembly vote, leaves the portico in indignation, and pledges to vote against him.',
        whatTheyAssumed: '"He has aligned himself with the Spartan sympathizers and publicly disowns me."',
        whatActuallyHappened:
          'The citizen was muttering a legal defense he had to deliver before five hundred magistrates at sundown, his mind entirely locked in memory.',
        quote: '"He who looks for enmity in a silent gaze will surely plant a vineyard of thorns."',
        visualAtmosphere: {
          artStyle: 'Classical Greek architectural landscape with fluted Doric columns',
          lighting: 'Blinding Aegean sun reflecting off pentelic marble into cool colonnade shadows',
          colorPalette: ['#1e3a8a', '#0284c7', '#f8fafc'],
          sceneryDetail: 'Fluted white marble pillars, terracotta roof tiles, dusty Agora square framing olive trees and distant Acropolis',
          sensoryDetail: 'Hum of buzzing cicadas, distant murmur of marketplace philosophers, and sea breeze',
          sceneSvgType: 'classical_athens',
        },
      },
      {
        id: 'era-industrial-dawn',
        year: '1815',
        label: 'The Industrial Dawn (1815)',
        setting: 'Vienna Ballrooms & Gaslit London Cobblestones',
        technology: 'Gas lamps, steam printing presses, sealed wax correspondence, brass pocket watches',
        costume: 'Tailored woolen frock coats, silk cravats, top hats, silver-headed canes',
        howTheDilemmaAppeared:
          'An attaché passes a diplomatic colleague in the gaslit foyer of the Embassy without tipping his brim or returning a bow. The slighted diplomat departs immediately in a hansom cab, assumes he has been socially blacklisted, and burns his draft treaty notes in proud retaliation.',
        whatTheyAssumed: '"A calculated social cut designed to diminish my standing before the Prince Regent."',
        whatActuallyHappened:
          'The attaché had left his reading spectacles on his desk and could not distinguish a face five paces into the foggy lantern smoke.',
        quote: '"More duels have been fought over poor eyesight and proud hearts than over empires."',
        visualAtmosphere: {
          artStyle: 'Rich 19th-century atmospheric oil painting with glowing gas lanterns',
          lighting: 'Warm amber halos cutting through dense rainy London mist and polished mahogany reflections',
          colorPalette: ['#451a03', '#b45309', '#fef3c7'],
          sceneryDetail: 'Gilded parlor mirrors, velvet draperies, wet cobblestones glistening under wrought-iron lamps',
          sensoryDetail: 'Scent of damp wool, coal smoke, pipe tobacco, and rain on stone',
          sceneSvgType: 'industrial_dawn',
        },
      },
      {
        id: 'era-digital-present',
        year: '2026',
        label: 'The Digital Present (2026)',
        setting: 'Modern Glass Architectural Atrium & Office Hallway',
        technology: 'OLED smartphones, wireless noise-canceling earbuds, cloud chat',
        costume: 'Casual black hoodies, minimalist sneakers, smartwatch displays',
        howTheDilemmaAppeared:
          summary ||
          'Someone walks past you in the corridor without saying hello. You feel an immediate sting of rejection, assume they are purposely ignoring you, and decide to give them the exact same cold shoulder next time.',
        whatTheyAssumed: '"They saw me and intentionally ghosted me. I refuse to be the fool who speaks first."',
        whatActuallyHappened:
          'Their noise-canceling headphones were at 80% volume listening to an urgent audio briefing, their eyes scanning a work notification while mentally juggling rent and family stress.',
        quote: '"We carry supercomputers to bridge the planet, yet two people ten feet apart can still build an emotional prison."',
        visualAtmosphere: {
          artStyle: 'Moody 35mm cinematic film still with twilight urban architecture',
          lighting: 'Cool blue exterior twilight softened by warm interior architectural downlights and screen glow',
          colorPalette: ['#0f172a', '#38bdf8', '#f8fafc'],
          sceneryDetail: 'Polished concrete floors, frameless glass partitions, city dusk visible through panoramic windows',
          sensoryDetail: 'Faint hiss of HVAC air, distant subway rumble, soft tap of sneakers on polished floors',
          sceneSvgType: 'digital_present',
        },
      },
      {
        id: 'era-orbital-colony',
        year: '2180',
        label: 'Orbital Colony (2180)',
        setting: 'Lagrange-4 Orbital Station Observation Ring',
        technology: 'Quantum telemetry, holographic wrist bands, synthetic atmosphere scrubbers',
        costume: 'Pressurized magnetic-soled flight suits, heads-up retinal displays, titanium clips',
        howTheDilemmaAppeared:
          'A life-support specialist floats past a navigation officer in the curved transit corridor without pinging the proximity greeting beacon. The officer assumes a factional cold war over orbital shift assignments, returns to the module, and cancels their shared telemetry sync.',
        whatTheyAssumed: '"The outer-rim crew has turned against us; they won’t even broadcast a handshake token."',
        whatActuallyHappened:
          'A pressure differential alarm had just flashed in the specialist’s retinal visor, commanding 100% of her cognitive focus on an oxygen scrub valve four modules ahead.',
        quote: '"A million kilometers from Earth, inside a titanium vacuum flask, human pride still invents phantoms."',
        visualAtmosphere: {
          artStyle: 'Sleek cinematic sci-fi concept art with curved architectural titanium',
          lighting: 'Brilliant sapphire rim of planet Earth glowing through the curved viewport into deep starry black',
          colorPalette: ['#020617', '#06b6d4', '#e0f2fe'],
          sceneryDetail: 'Gigantic curved panoramic quartz viewport, floating dust motes in microgravity, glowing cyan telemetry HUDs',
          sensoryDetail: 'Low rhythmic drone of oxygen pumps and the profound silence of deep orbit',
          sceneSvgType: 'orbital_colony',
        },
      },
    ];
  }

  if (isChoresOrBurnout) {
    return [
      {
        id: 'era-bronze-age',
        year: '1200 BCE',
        label: 'Bronze Age (~1200 BCE)',
        setting: 'Communal Grain Granary & Village Hearth',
        technology: 'Hand-grindstones, clay storage jars, wood fire embers',
        costume: 'Rough linen aprons, woven rush mats, blackened soot rags',
        howTheDilemmaAppeared:
          'One household member stays up past midnight sweeping the threshing floor and sealing the grain jars from vermin, silently smoldering as others sleep by the hearth, convinced nobody cares.',
        whatTheyAssumed: '"They treat me as an ox because they believe I have no pride."',
        whatActuallyHappened: 'The others assumed grain sealing was finished at dusk and had no idea the jars were leaking.',
        quote: '"The donkey carries the grain until it drops, not because the driver is cruel, but because the donkey never balked."',
        visualAtmosphere: {
          artStyle: 'Ancient terracotta fresco with warm cracked earth tones',
          lighting: 'Ember-lit hearth glow flickering across rough timber beams',
          colorPalette: ['#78350f', '#d97706', '#fde68a'],
          sceneryDetail: 'Stack of clay jars, sweep broom made of reeds, stone hearth glowing in dark',
          sensoryDetail: 'Smell of woodsmoke, roasted grain, and cool night dust',
          sceneSvgType: 'bronze_age',
        },
      },
      {
        id: 'era-classical-antiquity',
        year: '400 BCE',
        label: 'Classical Antiquity (~400 BCE)',
        setting: 'Athenian Oikos (Domestic Courtyard)',
        technology: 'Loom shuttles, bronze basins, olive oil jars',
        costume: 'Simple domestic tunics, bound hair cords',
        howTheDilemmaAppeared:
          'One family partner cleans the cistern pipes and restocks the olive lamps every evening in bitter silence, waiting for the other to notice without ever speaking up.',
        whatTheyAssumed: '"If they truly valued this household, they would see the basin is empty without being asked."',
        whatActuallyHappened: 'The other was consumed with civic duties at the court, assuming the household routine was effortlessly handled.',
        quote: '"Expectation without speech is merely an ambush for the innocent."',
        visualAtmosphere: {
          artStyle: 'Classical Greek architectural landscape with fluted Doric columns',
          lighting: 'Golden sunset over domestic peristyle courtyard',
          colorPalette: ['#1e3a8a', '#0284c7', '#f8fafc'],
          sceneryDetail: 'Domestic stone basin, wool on spinning distaff, terracotta floor tiles',
          sensoryDetail: 'Faint olive oil lamp scent and evening breeze through columns',
          sceneSvgType: 'classical_athens',
        },
      },
      {
        id: 'era-industrial-dawn',
        year: '1815',
        label: 'The Industrial Dawn (1815)',
        setting: 'Victorian Kitchen Hearth & Scullery',
        technology: 'Cast-iron coal range, copper boilers, scrub brushes',
        costume: 'Starch aprons, heavy serge skirts, rolled sleeves',
        howTheDilemmaAppeared:
          'One partner works until 2 AM scrubbing the coal soot from the range and ironing linens, banging iron pans loudly in the hope of provoking guilt.',
        whatTheyAssumed: '"They deliberately leave everything for me because they see me as their subordinate."',
        whatActuallyHappened: 'The household assumed tasks were divided according to habit, completely unaware of the physical exhaustion.',
        quote: '"The loudest clatter of iron pots is still weaker than five quiet words."',
        visualAtmosphere: {
          artStyle: 'Rich 19th-century atmospheric oil painting with glowing gas lanterns',
          lighting: 'Flickering copper stove glow and blue moonlight from small scullery window',
          colorPalette: ['#451a03', '#b45309', '#fef3c7'],
          sceneryDetail: 'Black cast-iron stove, shining copper pans hanging from rafters, scrubbed wooden table',
          sensoryDetail: 'Smell of beeswax, coal ash, and carbolic soap',
          sceneSvgType: 'industrial_dawn',
        },
      },
      {
        id: 'era-digital-present',
        year: '2026',
        label: 'The Digital Present (2026)',
        setting: 'Modern Open-Concept Apartment Kitchen',
        technology: 'Dishwasher, smart speaker, robotic vacuum',
        costume: 'Sweatpants, oversized tee, socks on hardwood floor',
        howTheDilemmaAppeared:
          summary ||
          'Doing all the dishes and laundry while silently seething at your partner on the couch, waiting for them to read your mind.',
        whatTheyAssumed: '"They see the pile in the sink and actively choose to disrespect my time."',
        whatActuallyHappened: 'They were mentally exhausted from a 9-hour screen day and assumed the chores were being done tomorrow together.',
        quote: '"Mind-reading is the most expensive mistake in any partnership."',
        visualAtmosphere: {
          artStyle: 'Moody 35mm cinematic film still with twilight urban architecture',
          lighting: 'Under-cabinet warm LED strips highlighting stainless steel and shadowy living room',
          colorPalette: ['#0f172a', '#38bdf8', '#f8fafc'],
          sceneryDetail: 'Stainless steel sink with plates, kitchen island, laptop glowing in background',
          sensoryDetail: 'Hum of refrigerator, warm dishwater steam, evening street traffic',
          sceneSvgType: 'digital_present',
        },
      },
      {
        id: 'era-orbital-colony',
        year: '2180',
        label: 'Orbital Colony (2180)',
        setting: 'Orbital Station Hydroponic Bio-Ring',
        technology: 'Aeroponic misting valves, algae culture tubes, nutrient recyclers',
        costume: 'Synthetic work coveralls, utility harnesses',
        howTheDilemmaAppeared:
          'One technician cleans the algae sludge from the air recyclers day after day while crewmates relax in the VR lounge, stewing in zero-gravity resentment.',
        whatTheyAssumed: '"The command staff views my role as sub-station sanitation."',
        whatActuallyHappened: 'The automated schedule had a broken sync ticket; crewmates thought the bio-cycle was handled by auto-scrubbers.',
        quote: '"In an orbital vacuum, silent bitterness drains oxygen faster than a hull breach."',
        visualAtmosphere: {
          artStyle: 'Sleek cinematic sci-fi concept art with curved architectural titanium',
          lighting: 'Bioluminescent green algae tubes casting eerie glow along curved titanium bulkheads',
          colorPalette: ['#020617', '#10b981', '#d1fae5'],
          sceneryDetail: 'Curved aeroponic rack, nutrient drip lines, observation porthole showing lunar crater',
          sensoryDetail: 'Earthy smell of damp spirulina culture and circulating recycled air',
          sceneSvgType: 'orbital_colony',
        },
      },
    ];
  }

  // 4. Boundary / Parenting / Giving in
  if (isParentingOrBoundary) {
    return [
      {
        id: 'era-bronze-age',
        year: '1200 BCE',
        label: 'Bronze Age (~1200 BCE)',
        setting: 'Village Market & Bronze Age Hearth',
        technology: 'Clay toys, dried fig strings, woven goat hair cords',
        costume: 'Linen tunics, leather thongs, bead amulets',
        howTheDilemmaAppeared:
          'A tired elder gives a weeping child honey-soaked dates at the temple gate just to silence the screaming in front of the clan, teaching the child that shouting always wins.',
        whatTheyAssumed: '"Giving in once brings peace and avoids shame before the elders."',
        whatActuallyHappened: 'The child immediately learned that escalation breaks the boundary every single time.',
        quote: '"Feed the wolf to make him leave, and tomorrow he brings three more to your gate."',
        visualAtmosphere: {
          artStyle: 'Ancient Mediterranean terracotta fresco with cracked lime plaster',
          lighting: 'Dusty temple sunbeams illuminating stone threshold and clay jars',
          colorPalette: ['#78350f', '#d97706', '#fde68a'],
          sceneryDetail: 'Temple gate, stone threshold, scattered date seeds, dusty clay road',
          sensoryDetail: 'Smell of frankincense smoke, warm dust, and sweet honeyed figs',
          sceneSvgType: 'bronze_age',
        },
      },
      {
        id: 'era-classical-antiquity',
        year: '400 BCE',
        label: 'Classical Antiquity (~400 BCE)',
        setting: 'Athenian Agora Sweet Stalls',
        technology: 'Wax tablets, bronze coins, terracotta figurines',
        costume: 'Woolen chitons, leather thong sandals',
        howTheDilemmaAppeared:
          'An Athenian tutor yields to a pupil’s tantrum and buys almond honey-pastries to avoid an embarrassing scene in front of prominent senators.',
        whatTheyAssumed: '"A small concession preserves my reputation today."',
        whatActuallyHappened: 'The pupil turned every future instruction into a public hostage negotiation.',
        quote: '"The rope that gives slack when pulled will soon be tied around the master’s neck."',
        visualAtmosphere: {
          artStyle: 'Classical Greek architectural landscape with fluted Doric columns',
          lighting: 'Sunlight filtering through wicker awning onto stone Agora floor',
          colorPalette: ['#1e3a8a', '#0284c7', '#f8fafc'],
          sceneryDetail: 'Wicker baskets of dried fruit, marble pedestals, philosophers watching from afar',
          sensoryDetail: 'Almond pastry sweetness, warm marble, distant chatter',
          sceneSvgType: 'classical_athens',
        },
      },
      {
        id: 'era-industrial-dawn',
        year: '1815',
        label: 'The Industrial Dawn (1815)',
        setting: 'Victorian Confectioner & Gaslit Parlor',
        technology: 'Glass bell jars, printed copperplate trade cards, sugar loaves',
        costume: 'Velvet jackets, lace collars, polished boots',
        howTheDilemmaAppeared:
          'A governess hands peppermint drops to a screaming child in a crowded carriage to stop the passengers from glaring, reinforcing the tyranny of tears.',
        whatTheyAssumed: '"Temporary quiet is worth a spoonful of sugar."',
        whatActuallyHappened: 'The child weaponized crying for every carriage ride that winter.',
        quote: '"Peace bought with surrender is merely an installment payment on rebellion."',
        visualAtmosphere: {
          artStyle: 'Rich 19th-century atmospheric oil painting with glowing gas lanterns',
          lighting: 'Warm gas lantern glow reflecting on foggy carriage windows and red plush seats',
          colorPalette: ['#451a03', '#b45309', '#fef3c7'],
          sceneryDetail: 'Glass candy jar, leather carriage upholstery, rainy street lamps outside',
          sensoryDetail: 'Smell of peppermint oil, damp coach leather, and rain on wool',
          sceneSvgType: 'industrial_dawn',
        },
      },
      {
        id: 'era-digital-present',
        year: '2026',
        label: 'The Digital Present (2026)',
        setting: 'Grocery Store Checkout & Smart Screen',
        technology: 'Smartphones, tablet games, point-of-sale scanners',
        costume: 'Winter coats, tote bags, wireless earbuds',
        howTheDilemmaAppeared:
          summary ||
          'Handing over the phone or buying candy at the checkout line to make the meltdown stop, accidentally programming the child that loud screaming unlocks screen time.',
        whatTheyAssumed: '"I just need to survive this checkout without people judging me."',
        whatActuallyHappened: 'The algorithmic reinforcement loop rewarded the exact behavior you wanted to stop.',
        quote: '"We surrender our boundaries for five minutes of silence, then pay for it in five years of noise."',
        visualAtmosphere: {
          artStyle: 'Moody 35mm cinematic film still with twilight urban architecture',
          lighting: 'Fluorescent supermarket strip lights gleaming on candy racks and scanner screens',
          colorPalette: ['#0f172a', '#38bdf8', '#f8fafc'],
          sceneryDetail: 'Conveyor belt, rows of colorful checkout sweets, smartphone glowing with cartoons',
          sensoryDetail: 'Beeping barcode scanner, distant shopping cart wheels, rustling plastic',
          sceneSvgType: 'digital_present',
        },
      },
      {
        id: 'era-orbital-colony',
        year: '2180',
        label: 'Orbital Colony (2180)',
        setting: 'Orbital Habitat Nursery & Simulation Pods',
        technology: 'Haptic toys, bio-monitoring bracelets, neural dream projectors',
        costume: 'Soft synthetic jumpsuits, micro-magnetic play slippers',
        howTheDilemmaAppeared:
          'A station creche worker overrides the quota limit on the holographic simulator to quiet an upset child, teaching the habitat kids that alarms force adult overrides.',
        whatTheyAssumed: '"Lowering the habitat noise index right now avoids crew sleep disruption."',
        whatActuallyHappened: 'Every junior colonist began triggering habitat alarms when denied access to games.',
        quote: '"Rules bent under pressure become the cracks that leak station atmosphere."',
        visualAtmosphere: {
          artStyle: 'Sleek cinematic sci-fi concept art with curved architectural titanium',
          lighting: 'Soft glowing holographic sea creatures swimming in mid-air inside curved nursery dome',
          colorPalette: ['#020617', '#06b6d4', '#e0f2fe'],
          sceneryDetail: 'Padded curved habitat floor, floating interactive light bubbles, starfield outside viewport',
          sensoryDetail: 'Gentle synthetic breeze, soft chimes, and deep space quiet',
          sceneSvgType: 'orbital_colony',
        },
      },
    ];
  }

  // Universal dynamic translation
  const cleanSummary = summary || userInput || 'A human misunderstanding where assumptions triggered defense.';
  return [
    {
      id: 'era-bronze-age',
      year: '1200 BCE',
      label: 'Bronze Age (~1200 BCE)',
      setting: 'Ancient Mycenaean Citadel Courtyard',
      technology: 'Clay tablets, copper chisels, oil lamps, linen sailcloth',
      costume: 'Woven linen tunics, leather belts, bronze armbands',
      howTheDilemmaAppeared: `Underneath the bronze armor and clay tablets, two clan members faced this exact friction: ${cleanSummary}. One assumed malice, took defensive action, and ignited a dispute that lasted seasons.`,
      whatTheyAssumed: '"They intended harm and disrespect toward my household."',
      whatActuallyHappened: 'Both parties were operating under incomplete information and fear of looking weak.',
      quote: '"The clay tablet crumbles, but the stubborn heart endures."',
      visualAtmosphere: {
        artStyle: 'Ancient Mediterranean terracotta fresco with cracked lime plaster',
        lighting: 'Deep amber sunset glow across stone battlements and olive trees',
        colorPalette: ['#78350f', '#d97706', '#fde68a'],
        sceneryDetail: 'Massive stone gateway, olive jars, distant Aegean Sea',
        sensoryDetail: 'Dry summer wind carrying wild sage and pine resin',
        sceneSvgType: 'bronze_age',
      },
    },
    {
      id: 'era-classical-antiquity',
      year: '400 BCE',
      label: 'Classical Antiquity (~400 BCE)',
      setting: 'The Athenian Agora Colonnade',
      technology: 'Parchment, wax tablets, silver drachmas, bronze scales',
      costume: 'Draped himations, woven sandals, olive branch pins',
      howTheDilemmaAppeared: `In the heart of Athens, two peers clashed over this exact pattern: ${cleanSummary}. Each assumed the other’s silence was pride, retreating to their respective circles.`,
      whatTheyAssumed: '"Their demeanor is calculated defiance."',
      whatActuallyHappened: 'An unexpressed vulnerability masked as philosophical detachment.',
      quote: '"We argue about justice, but we trip over pride on our own doorstep."',
      visualAtmosphere: {
        artStyle: 'Classical Greek architectural landscape with fluted Doric columns',
        lighting: 'High noon sun gleaming on white pentelic marble porticos',
        colorPalette: ['#1e3a8a', '#0284c7', '#f8fafc'],
        sceneryDetail: 'Fluted marble pillars framing azure sky and Agora courtyard',
        sensoryDetail: 'Warm stone heat and sound of distant Assembly debates',
        sceneSvgType: 'classical_athens',
      },
    },
    {
      id: 'era-industrial-dawn',
      year: '1815',
      label: 'The Industrial Dawn (1815)',
      setting: 'Vienna Ballrooms & London Parlors',
      technology: 'Gas lamps, steam presses, wax-sealed letters, pocket watches',
      costume: 'Frock coats, silk waistcoats, high cravats, top hats',
      howTheDilemmaAppeared: `Behind heavy velvet curtains and gaslit mirrors, two colleagues experienced this exact tension: ${cleanSummary}. Rather than speak directly, they withdrew into cold restraint.`,
      whatTheyAssumed: '"A grave breach of protocol and deliberate insult."',
      whatActuallyHappened: 'A simple clerical delay and mutual terror of losing face.',
      quote: '"The ink on the page is cool, but the wounded ego burns like coal."',
      visualAtmosphere: {
        artStyle: 'Rich 19th-century atmospheric oil painting with glowing gas lanterns',
        lighting: 'Warm gaslight flickering across dark mahogany and gilded mirrors',
        colorPalette: ['#451a03', '#b45309', '#fef3c7'],
        sceneryDetail: 'Gilded picture frames, ornate fireplace, rain drumming against window panes',
        sensoryDetail: 'Scent of old book leather, beeswax, and coal warmth',
        sceneSvgType: 'industrial_dawn',
      },
    },
    {
      id: 'era-digital-present',
      year: '2026',
      label: 'The Digital Present (2026)',
      setting: 'Contemporary Minimalist Office & City Street',
      technology: 'Smartphones, cloud messaging, noise-canceling headphones',
      costume: 'Hoodies, sneakers, minimalist smartwatches',
      howTheDilemmaAppeared: cleanSummary,
      whatTheyAssumed: 'A personal slight, lack of care, or deliberate confrontation.',
      whatActuallyHappened: 'Unseen situational stress, cognitive overload, and defensive assumptions.',
      quote: '"We connected the entire planet with light speed, but we still fear walking across the room."',
      visualAtmosphere: {
        artStyle: 'Moody 35mm cinematic film still with twilight urban architecture',
        lighting: 'Cool blue hour twilight accented by warm interior architectural glows',
        colorPalette: ['#0f172a', '#38bdf8', '#f8fafc'],
        sceneryDetail: 'Clean glass architecture, city lights reflecting on pavement, minimal silhouettes',
        sensoryDetail: 'Muffled urban hum and soft screen glow',
        sceneSvgType: 'digital_present',
      },
    },
    {
      id: 'era-orbital-colony',
      year: '2180',
      label: 'Orbital Colony (2180)',
      setting: 'Deep Space Station Observation Cupola',
      technology: 'Quantum telemetry, holographic interfaces, synthetic biospheres',
      costume: 'Pressurized magnetic transit suits, HUD visors',
      howTheDilemmaAppeared: `Orbiting Saturn’s rings or overlooking Earth, two station engineers faced this same dynamic: ${cleanSummary}. Even with humanity’s most advanced tech, two humans fell into the same defensive posture.`,
      whatTheyAssumed: '"Hostile factional politics and mission insubordination."',
      whatActuallyHappened: 'A communication lag and fear of being deemed unreliable.',
      quote: '"We left our home planet behind, but we brought our ancient fears with us in the airlocks."',
      visualAtmosphere: {
        artStyle: 'Sleek cinematic sci-fi concept art with curved architectural titanium',
        lighting: 'Deep space starfield and brilliant sapphire Earth crescent illumination',
        colorPalette: ['#020617', '#06b6d4', '#e0f2fe'],
        sceneryDetail: 'Curved titanium structural ribs, transparent panoramic dome, glowing holo-displays',
        sensoryDetail: 'Low subsonic vibration of reaction wheels and silent cosmic void',
        sceneSvgType: 'orbital_colony',
      },
    },
  ];
}
