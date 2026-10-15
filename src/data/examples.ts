import { TranslationResult } from '../types/translation';

export const EXAMPLE_TOPICS: TranslationResult[] = [
  {
    id: 'example-court-car',
    unfamiliarTopic: 'Courtroom procedures and how a civil or criminal trial unfolds',
    familiarDomain: 'Car mechanics and vehicle diagnostics in an auto shop',
    headlineSummary: 'A courtroom is not an argument over who is louder; it is a systematic garage diagnostic where specific tools are inspected before any engine is rebuilt.',
    simplicityLevel: 'standard',
    frameworkFlow: {
      reality: 'Legal disputes must resolve complex conflicting claims without relying on personal whims or untested assumptions.',
      observation: 'Trials feel rigid, painfully slow, and obsessed with procedural rules and formal objections.',
      translation: 'Like a mechanic who will not touch an engine until the diagnostic computer reads exact trouble codes and verifies wiring.',
      understanding: 'Procedures exist to keep contaminated evidence from seizing the system, exactly like keeping contaminated oil out of an engine block.',
      action: 'Focus on what verifiable documents and inspection records exist rather than emotional assertions.'
    },
    section1Connects: {
      summary: 'Every step in a court case mirrors what a thorough mechanic does when an engine breaks down.',
      narrative: 'When an engine knocks, a mechanic does not just guess and replace the transmission. They write an intake ticket (filing the complaint), check sensor trouble codes with a scan tool (the discovery process where both sides exchange papers), test components on a bench (evidentiary hearings), and only then make the official repair call (the verdict). The judge acts like the shop foreman making sure safety regulations are obeyed, while the attorneys are the technicians pointing to specific worn belts and failed gaskets.',
      realLifeExamples: [
        'Discovery is the diagnostic scan tool: both sides must plug in and look at the exact same sensor readings before anyone goes to trial.',
        'Rules of Evidence are the oil filter: if a witness brings third-hand rumor (hearsay), the judge filters it out so contaminated debris does not wreck the engine cylinder.',
        'Opening statements are the repair estimate: the mechanic walks the customer through what they believe is broken and what tests will prove it.'
      ],
      mappings: [
        {
          unfamiliarElement: 'Filing the Initial Complaint & Answer',
          familiarElement: 'The Shop Intake Work Order',
          underlyingDynamic: 'Establishing the boundary of work',
          explanation: 'You write down the exact symptoms and what needs fixing. The mechanic cannot bill you to replace the exhaust if you came in for brake pads.'
        },
        {
          unfamiliarElement: 'Discovery Phase (Subpoenas, Depositions, Documents)',
          familiarElement: 'Diagnostic Testing & Engine Teardown',
          underlyingDynamic: 'Shared inspection of reality',
          explanation: 'Before trial, both sides look under the hood together. In court, surprise evidence is banned just like hiding broken parts from the inspector.'
        },
        {
          unfamiliarElement: 'Judicial Objections (e.g. Hearsay, Relevance)',
          familiarElement: 'Clean Workspace & Contaminant Filters',
          underlyingDynamic: 'Quality control and filtration',
          explanation: 'An objection is not rude interruption; it is shouting "stop, you dropped a dirty bolt into the spark plug cylinder!" to prevent engine seizure.'
        },
        {
          unfamiliarElement: 'Burden of Proof (Preponderance vs. Beyond Reasonable Doubt)',
          familiarElement: 'Safety Inspection Tolerances',
          underlyingDynamic: 'Thresholds of operational certainty',
          explanation: 'Civil court is like tire tread depth (51% more likely than not is enough to pass), while criminal court is an airplane turbine clearance (zero room for play).'
        }
      ]
    },
    section2Differences: {
      summary: 'Where the car mechanic comparison breaks down and caution is needed.',
      breakdowns: [
        {
          aspect: 'Human Intent vs. Mechanical Physics',
          whereComparisonWorks: 'Both seek the root cause of a breakdown using established tools.',
          whereItFails: 'A worn brake rotor has no feelings, memory bias, or motive. Courtroom witnesses can misremember, misinterpret, or deliberately shade the truth.',
          riskOfAssumingIdentical: 'Assuming witnesses behave like predictable metal parts leads to shock when two honest people testify to completely opposite memories.'
        },
        {
          aspect: 'Precedent vs. Factory Manuals',
          whereComparisonWorks: 'Both refer to established manuals (statutes and service specs).',
          whereItFails: 'Car service manuals describe exact torque numbers (e.g., 85 ft-lbs). Legal precedents leave deliberate room for human discretion, equity, and context.',
          riskOfAssumingIdentical: 'Expecting a court ruling to be a binary math formula will leave you bewildered when judicial discretion applies.'
        },
        {
          aspect: 'Finality & Reversibility',
          whereComparisonWorks: 'A finished repair can be taken back to the shop if a rattle returns.',
          whereItFails: 'Appeals courts do not re-listen to testimony or retry facts; they only check if the foreman followed legal procedure during the repair.',
          riskOfAssumingIdentical: 'Believing you can easily "get another mechanic" ignores the strict, time-sensitive finality of court judgments.'
        }
      ]
    },
    section3Missing: {
      establishedFacts: [
        'Courts enforce strict deadlines; missing a filing date by one day can forfeit valid claims permanently.',
        'Evidence must meet formal legal tests for relevance and authentication before a jury ever sees it.',
        'Judges rule strictly on procedural law; juries (or bench judges) determine which factual version to believe.'
      ],
      assumptionsAndInterpretations: [
        'People frequently assume the judge knows the full backstory; in reality, the judge knows only what was entered into evidence on the record.',
        'People assume the "truth speaks for itself," forgetting that evidence without proper chain-of-custody foundation is inadmissible.'
      ],
      missingInformation: [
        'Local court rules (every courthouse has local standing orders that override general instincts).',
        'The settlement pressures: over 90% of cases settle during discovery before any trial occurs.',
        'The financial and emotional friction cost of prolonged procedural motions.'
      ],
      overlookedConnections: [
        'Procedural delays are often strategic tests of economic endurance rather than purely administrative slowness.',
        'The emotional tone of a party often signals unstated fears rather than the legal merits of their claim.'
      ],
      questionsToAsk: [
        'What specific admissible documents prove my primary claim without needing anyone\'s personal opinion?',
        'What are the mandatory calendar deadlines for our jurisdiction?',
        'What would a negotiated resolution look like before entering the expensive discovery teardown?'
      ],
      howToResolveUncertainty: [
        'Request the court docket sheet to inspect all filed motions and orders.',
        'Consult licensed legal counsel in the exact governing jurisdiction (laws vary heavily by state/country).'
      ]
    },
    section4NextSteps: {
      summary: 'Practical ways to organize your thinking and verify where you stand.',
      practicalSteps: [
        'Create a chronological binder or spreadsheet with date, document title, and who signed it—just like a vehicle maintenance log.',
        'Separate your personal feelings from documentary receipts (emails, contracts, bank statements).',
        'Identify what exact remedy or outcome is legally authorized by statute rather than what feels emotionally fair.'
      ],
      verificationMethods: [
        'Check the local courthouse public records portal to review actual sample complaints and answers.',
        'Review the jurisdiction\'s official rules of civil or criminal procedure.'
      ],
      cautionaryLimitations: 'Legal Information Only: This translation is designed for conceptual understanding and does not constitute formal legal advice. Court rules vary by state and county; always consult a licensed attorney.'
    },
    bidirectionalInsights: {
      unfamiliarToFamiliar: 'Looking at court procedures through car mechanics reveals that legal proceedings are not theater—they are strict, diagnostic safety protocols to prevent catastrophic system collapse.',
      familiarToUnfamiliar: 'Looking at car mechanics through court procedures reveals that even in auto repair, a mechanic is quietly building a chain of proof: saving old broken parts is equivalent to preserving evidence for the customer.'
    }
  },
  {
    id: 'example-rumours-network',
    unfamiliarTopic: 'How rumours and information spread through social networks and how verification distinguishes fact from speculation',
    familiarDomain: 'A neighborhood game of telephone and emergency dispatch logbooks',
    headlineSummary: 'A rumour is not fact plus time; it is an unverified observation that mutates at every retelling because each person fills in the blanks with their own emotional assumptions.',
    simplicityLevel: 'standard',
    frameworkFlow: {
      reality: 'Information networks degrade rapidly unless anchored by primary physical telemetry or authenticated records.',
      observation: 'Sensational claims spread ten times faster than retractions, leading whole communities into anxiety.',
      translation: 'Like a neighborhood telephone game where someone spots an ambulance, and three retellings later it becomes a catastrophic hazmat disaster.',
      understanding: 'Speculation explodes along emotional vectors; inspecting a single verified dispatch log instantly collapses false narrative branches.',
      action: 'Trace claims to the primary observer and check timestamped official logs before repeating.'
    },
    section1Connects: {
      summary: 'Information networks function like electrical wires with noisy resistors at every node.',
      narrative: 'When an event happens, the first person directly observes a simple fact: "An emergency vehicle parked outside with lights flashing." But when they tell a friend, they add interpretation: "It looked serious." When that friend texts a group chat, they extrapolate: "It must be a hazardous chemical spill!" Each transmission acts like a distortion lens. Only when someone pauses and queries primary documentation (the 911 dispatch record) does the speculative chain collapse back to ground truth: burnt toast in a break room.',
      realLifeExamples: [
        'The First Node is Observation: Seeing emergency lights without knowing the dispatch reason.',
        'The Middle Nodes are Inflation: Interpreting absence of facts as evidence of a dramatic secret.',
        'The Verifier Node is Ground Truth: Checking the public record or official logbook to puncture the rumor bubble.'
      ],
      mappings: [
        {
          unfamiliarElement: 'Viral Social Media Diffusion',
          familiarElement: 'The Neighborhood Telephone Game',
          underlyingDynamic: 'Iterative transmission distortion',
          explanation: 'Each repetition strips away nuance and adds emotional exaggeration to keep the listener hooked.'
        },
        {
          unfamiliarElement: 'Confirmation Bias in Retweets',
          familiarElement: 'Filling in the Blanks with Existing Feuds',
          underlyingDynamic: 'Projection of preexisting fears',
          explanation: 'People believe rumours not because they have proof, but because the rumour confirms what they already feared.'
        },
        {
          unfamiliarElement: 'Fact-Checking & Primary Source Verification',
          familiarElement: 'Looking at the Mechanic\'s Computer Scan / Fire Dispatch Log',
          underlyingDynamic: 'Ground truth calibration',
          explanation: 'One authentic primary record disproves thousands of speculative retweets in an instant.'
        }
      ]
    },
    section2Differences: {
      summary: 'Where digital information networks differ from small neighborhood rumors.',
      breakdowns: [
        {
          aspect: 'Scale & Algorithmic Amplification',
          whereComparisonWorks: 'Both distort through retelling and emotional bias.',
          whereItFails: 'Neighborhood rumors fade as people walk away. Algorithmic feeds optimize for outrage engagement, actively promoting distortions to millions.',
          riskOfAssumingIdentical: 'Underestimating the speed and global reach of modern coordinated disinformation campaigns.'
        },
        {
          aspect: 'Permanence & Search Indexing',
          whereComparisonWorks: 'Both damage reputations and sow confusion.',
          whereItFails: 'Spoken rumors dissolve into thin air; internet posts remain permanently indexed and searchable for years.',
          riskOfAssumingIdentical: 'Thinking an online rumour will simply "blow over" without formal documentation or correction.'
        }
      ]
    },
    section3Missing: {
      establishedFacts: [
        'Sensational or fear-inducing content spreads at significantly higher velocity than neutral factual statements.',
        'Most people who repost or share do not click through to examine primary documentation.',
        'Retractions reach less than 20% of the audience exposed to the original rumor.'
      ],
      assumptionsAndInterpretations: [
        'Assuming high share counts indicate veracity (popularity does not equal accuracy).',
        'Assuming the author of the post was an eyewitness (they are usually retelling third-hand accounts).'
      ],
      missingInformation: [
        'Who was the original eyewitness, and what did they physically see with their own eyes?',
        'What official public records, dispatch sheets, or photos exist?',
        'Does the claimant have a financial, political, or social incentive to exaggerate?'
      ],
      overlookedConnections: [
        'Rumours often reveal what a community is chronically anxious about rather than what actually happened.',
        'Silence from officials during an ongoing investigation is often legally mandated, not evidence of a conspiracy.'
      ],
      questionsToAsk: [
        'What is the primary document or timestamped video proving this claim?',
        'If this claim were false, what evidence would prove it false?',
        'Am I sharing this to inform others or because it gives me an emotional rush?'
      ],
      howToResolveUncertainty: [
        'Perform reverse image searches on photos used as "evidence".',
        'Consult neutral public agency portals, court dockets, or credible investigative fact-checkers.'
      ]
    },
    section4NextSteps: {
      summary: 'Healthy information hygiene to stop being misled.',
      practicalSteps: [
        'Apply the "Three-Node Rule": Never repeat a claim until you can identify at least one primary source.',
        'Check original documents before forming a final judgment.',
        'Pause for 10 minutes before sharing breaking or emotionally charged news.'
      ],
      verificationMethods: [
        'Search the official organization website or press release page.',
        'Check accredited fact-checking networks (AP Fact Check, Reuters, Snopes).'
      ],
      cautionaryLimitations: 'Information Hygiene Note: Distinguishing rumors from verified facts protects mental peace and community trust; always rely on verified local authorities during active crises.'
    },
    bidirectionalInsights: {
      unfamiliarToFamiliar: 'Looking at viral internet misinformation through the neighborhood telephone game reminds us that the internet hasn\'t created new human flaws—it has simply given high-voltage megaphones to our oldest playground gossip instincts.',
      familiarToUnfamiliar: 'Looking at playground telephone games through modern network science reveals that information integrity requires explicit error-correcting codes—such as written logs and verified receipts.'
    }
  },
  {
    id: 'example-battery-water',
    unfamiliarTopic: 'How rechargeable lithium-ion batteries work, degrade over time, and why fast charging creates heat and strain',
    familiarDomain: 'Everyday plumbing, water tanks, garden hoses, and reservoir pressure',
    headlineSummary: 'Electricity in a battery is not a mysterious fluid; it is water being pumped uphill into an elevated reservoir, where rushing too fast splashes heat and leaves mineral scale behind.',
    simplicityLevel: 'standard',
    frameworkFlow: {
      reality: 'Chemical batteries store energy by moving ions between two physical host structures across a barrier.',
      observation: 'Phones charge quickly at first then crawl at 90%, get scorching hot when fast-charging, and lose battery life after two years.',
      translation: 'Think of two water tanks connected by a pipe. Charging is pumping water up into the high tank; discharging is opening the tap to turn a waterwheel.',
      understanding: 'Batteries degrade because forcing ions too quickly into tight spaces causes physical microscopic cracking, exactly like water hammer bursting pipes.',
      action: 'Keep charge between 20% and 80% to avoid the extreme high-pressure and bone-dry suction regimes.'
    },
    section1Connects: {
      summary: 'Every electrical concept in your phone battery has an exact twin in your home plumbing.',
      narrative: 'Imagine two tanks of water separated by a pump and a filter. When your phone is dead, all the water is resting peacefully in the lower tank (the cathode). When you plug in your wall charger, a powerful pump forces water through a porous membrane up into an elevated tank packed with sponge-like graphite shelves (the anode). As you use your phone, you open a valve: the water rushes downhill through your phone\'s processor (a waterwheel), spinning it to power your screen. When you fast-charge, you blast high-pressure water with a firehose—it fills quickly, but water splashes violently, creates friction (heat), and strains the seams of the container.',
      realLifeExamples: [
        'Volts = Water Pressure: A higher water tower creates more pressure in the hose. A 3.7V battery has more push than a 1.5V AA cell.',
        'Amperes (Current) = Flow Rate: How many gallons per minute rush through the garden hose.',
        'Why 0-80% is fast but 80-100% crawls: Think of parking cars in a garage. When it is empty, cars zoom right in. When 90% full, the attendants have to crawl around searching for the last tight parking spots to avoid a crash.',
        'Heat during charging: Trying to shove 5 gallons a second through a narrow garden hose produces intense friction along the pipe walls.'
      ],
      mappings: [
        {
          unfamiliarElement: 'Voltage (V)',
          familiarElement: 'Water Pressure / Height of the Water Tower',
          underlyingDynamic: 'Potential energy differential',
          explanation: 'The higher the water tower, the harder water pushes through the hose nozzle when you turn the handle.'
        },
        {
          unfamiliarElement: 'Current (Amps) & Resistance (Ohms)',
          familiarElement: 'Water Flow Volume & Pipe Diameter / Clog',
          underlyingDynamic: 'Friction against transmission',
          explanation: 'A wide fire hose lets gallons gush easily (low resistance); a pinched straw restricts flow and heats up if forced.'
        },
        {
          unfamiliarElement: 'Battery Capacity (mAh / Watt-hours)',
          familiarElement: 'The Physical Size of the Water Reservoir',
          underlyingDynamic: 'Total volume of stored medium',
          explanation: 'A 5000 mAh battery is simply a 5000-gallon cistern. It determines how long you can run your sprinkler before the tank runs dry.'
        },
        {
          unfamiliarElement: 'Battery Degradation (Cycle Life Loss)',
          familiarElement: 'Mineral Scale & Sediment Buildup Inside the Tank',
          underlyingDynamic: 'Accumulated structural wear',
          explanation: 'Each time water is pumped back and forth, tiny mineral deposits coat the sponge shelves. Eventually, less room exists to hold clean water.'
        }
      ]
    },
    section2Differences: {
      summary: 'Where water pipes and lithium ions behave differently.',
      breakdowns: [
        {
          aspect: 'Continuous Fluid vs. Discrete Ion Migration',
          whereComparisonWorks: 'Both involve volume flow driven by pressure gradients.',
          whereItFails: 'Water is a bulk liquid that flows smoothly. Battery charging involves discrete lithium ions physically embedding (intercalating) inside atomic crystal lattices.',
          riskOfAssumingIdentical: 'Assuming you can just "pour in more charge" like topping off a gas can; if ions cannot find lattice spots, they plate as metallic lithium needles (dendrites) and cause short circuits.'
        },
        {
          aspect: 'Emptying to Zero',
          whereComparisonWorks: 'A dry water tank is simply empty and waits for the next rain.',
          whereItFails: 'Leaving a lithium battery at absolute 0% voltage causes copper collector foil to dissolve in the electrolyte, permanently destroying the cell.',
          riskOfAssumingIdentical: 'Believing the old myth from 1990s nickel-cadmium batteries that you should "fully drain the battery to 0% before recharging."'
        },
        {
          aspect: 'Temperature Sensitivity',
          whereComparisonWorks: 'Water pipes freeze and burst in winter.',
          whereItFails: 'Batteries suffer chemical resistance spikes in cold weather, meaning energy is present but ions cannot push through the viscous electrolyte paste.',
          riskOfAssumingIdentical: 'Thinking a phone dying in cold weather has "lost its charge"—once warmed up in your pocket, the chemical mobility returns.'
        }
      ]
    },
    section3Missing: {
      establishedFacts: [
        'High heat (over 35°C / 95°F) combined with sustained high state-of-charge (100%) accelerates permanent chemical degradation exponentially.',
        'Fast chargers negotiate voltage and amperage dynamically with the phone\'s battery management system (BMS).',
        'Modern smart devices have software buffers preventing actual absolute 0% and absolute 100% cell exposure.'
      ],
      assumptionsAndInterpretations: [
        'Many people assume leaving a phone plugged in overnight overcharges and "blows up" the battery; modern charging circuits shut off current automatically.',
        'People assume battery health meters are exact physical measurements; they are algorithmic estimates based on voltage curve models.'
      ],
      missingInformation: [
        'The ambient temperature of the charging environment (charging under a pillow destroys batteries faster than fast chargers).',
        'Whether the device is being actively used during charging (gaming while fast-charging creates double heat: CPU thermal load + battery chemical heat).',
        'The specific cathode chemistry (LFP lithium-iron-phosphate tolerates 100% charges far better than NMC nickel-manganese-cobalt).'
      ],
      overlookedConnections: [
        'Wireless charging feels gentler because it is slower, but inductive coils generate extra heat that often degrades the cell faster than a cool wired cable.',
        'Battery degradation is non-linear: cells degrade slowly from 100% to 80% health, then drop more rapidly once internal resistance mounts.'
      ],
      questionsToAsk: [
        'Does my device support an 80% charging limit feature in its battery settings?',
        'Am I exposing the phone to direct solar heat on car dashboards during navigation?',
        'Is the battery swollen (pushing up against the screen or back glass), which requires immediate replacement?'
      ],
      howToResolveUncertainty: [
        'Inspect the device\'s built-in Battery Health percentage or use diagnostic tools like AccuBattery.',
        'Check the manufacturer technical specifications for battery chemistry and maximum recommended wattage.'
      ]
    },
    section4NextSteps: {
      summary: 'Practical habits to maximize device lifespan and verify your battery state.',
      practicalSteps: [
        'Turn on "Optimized Battery Charging" or "Protect Battery" (caps charge at 80%–85% until right before your morning wake alarm).',
        'Avoid heavy 3D gaming or video editing while plugged into a high-wattage fast charger.',
        'Store unused devices around 50% charge in a cool, dry room—never dead empty and never pinned at 100%.'
      ],
      verificationMethods: [
        'Check the device settings (Settings → Battery → Battery Health).',
        'Measure charging speed drop-off with a USB-C power meter cable displaying real-time wattage.'
      ],
      cautionaryLimitations: 'Hardware & Safety Caution: If a device battery is visibly swollen or heating up without being plugged in, stop using it immediately. Swollen lithium cells pose a puncture fire hazard and should be recycled at a certified e-waste facility.'
    },
    bidirectionalInsights: {
      unfamiliarToFamiliar: 'Looking at lithium-ion batteries through plumbing demystifies electricity: voltage is just height, current is just volume, and heat is just friction.',
      familiarToUnfamiliar: 'Looking at plumbing through batteries reveals that just like batteries need a Battery Management System to throttle charging, modern water grids need automated pressure valves to stop surge shocks from fracturing old pipes.'
    }
  }
];
