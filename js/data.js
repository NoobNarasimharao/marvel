/* Curated library, reviewed 2026-10-15. One record per film, season or special.
 * Dates are original US releases when known, not fictional timeline positions.
 * Null dates deliberately preserve uncertainty. No date auto-completes a title.
 */
(function () {
  'use strict';
  const categories = [
    ['mcu-movies', 'MCU Movies', 'The Infinity Saga and the Multiverse Saga'],
    ['mcu-tv', 'MCU & Marvel Studios TV', 'Live action, legacy television and alternate-universe animation'],
    ['xmen-movies', 'X-Men & Fox Movies', 'Mutants across the original and revised Fox timelines'],
    ['xmen-tv', 'X-Men Television', 'Animated adventures and separate live-action continuities'],
    ['spider-movies', 'Spider-Man Movies', 'Three Peter Parkers and the animated Spider-Verse'],
    ['spider-tv', 'Spider-Man Television', 'Independent animated worlds and new adventures'],
    ['fantastic', 'Fantastic Four', 'Separate screen interpretations of Marvel’s first family'],
    ['sony', 'Sony Spider-Man Universe', 'Venom and Sony’s related standalone films'],
    ['other-movies', 'Other Marvel Movies', 'Blade, Ghost Rider and standalone adaptations'],
    ['defenders', 'The Defenders Saga', 'Street-level heroes, season by season'],
    ['other-tv', 'Other Marvel Television', 'Animation, specials and deeper cuts'],
    ['upcoming', 'Upcoming / Release Watch', 'Requested future projects and seasons awaiting verification']
  ].map(([id, name, description]) => ({ id, name, label: name, description }));
  const titles = [];
  const byId = new Map();
  const slug = value => value.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  function add(record) {
    const item = Object.assign({ series: '', season: null, year: null, date: null, phase: null,
      release: 'released', essential: false, related: [], poster: null, sources: [], aliases: [] }, record);
    item.recommended = titles.length + 100;
    if (byId.has(item.id)) throw new Error('Duplicate library ID: ' + item.id);
    titles.push(item); byId.set(item.id, item); return item;
  }
  function movie(title, year, phase, characters, synopsis, date) {
    return add({ id: slug(title) + '-' + year, title, year, date: date || null, type: 'movie',
      universes: ['MCU'], categories: ['mcu-movies'], group: 'Phase ' + phase, phase,
      characters: characters.split('|'), synopsis, continuity: 'Marvel Cinematic Universe; Phase ' + phase + '.' });
  }
  [
    ['Iron Man',2008,1,'Iron Man','Tony Stark builds an armored suit and reconsiders his legacy as a weapons manufacturer.','2008-05-02'],
    ['The Incredible Hulk',2008,1,'Hulk','Bruce Banner searches for a cure while the military pursues his powerful alter ego.','2008-06-13'],
    ['Iron Man 2',2010,1,'Iron Man|Black Widow|War Machine','Tony Stark confronts new rivals and the physical cost of his technology.','2010-05-07'],
    ['Thor',2011,1,'Thor|Loki','An exiled Asgardian prince learns humility on Earth.','2011-05-06'],
    ['Captain America: The First Avenger',2011,1,'Captain America|Bucky Barnes','Steve Rogers becomes a super soldier during the Second World War.','2011-07-22'],
    ['The Avengers',2012,1,'Iron Man|Captain America|Thor|Hulk|Black Widow|Hawkeye|Loki','Earth’s heroes unite to stop Loki and an invading army.','2012-05-04'],
    ['Iron Man 3',2013,2,'Iron Man','Tony Stark faces a campaign of attacks while struggling with the aftermath of New York.','2013-05-03'],
    ['Thor: The Dark World',2013,2,'Thor|Loki','Thor and Jane Foster confront a threat linked to an ancient cosmic force.','2013-11-08'],
    ['Captain America: The Winter Soldier',2014,2,'Captain America|Black Widow|Bucky Barnes|Falcon','Steve Rogers uncovers a conspiracy inside S.H.I.E.L.D.','2014-04-04'],
    ['Guardians of the Galaxy',2014,2,'Star-Lord|Gamora|Rocket|Groot|Drax','A group of outlaws comes together to protect a powerful orb.','2014-08-01'],
    ['Avengers: Age of Ultron',2015,2,'Iron Man|Captain America|Thor|Hulk|Scarlet Witch|Vision','The Avengers battle an artificial intelligence created to protect the world.','2015-05-01'],
    ['Ant-Man',2015,2,'Ant-Man|Wasp','Scott Lang uses a shrinking suit to help stop dangerous technology from changing hands.','2015-07-17'],
    ['Captain America: Civil War',2016,3,'Captain America|Iron Man|Bucky Barnes|Black Panther|Spider-Man','Government oversight and a personal conflict divide the Avengers.','2016-05-06'],
    ['Doctor Strange',2016,3,'Doctor Strange','An injured surgeon discovers the mystical arts and a threat beyond Earth.','2016-11-04'],
    ['Guardians of the Galaxy Vol. 2',2017,3,'Star-Lord|Gamora|Rocket|Groot|Drax','The Guardians investigate Peter Quill’s family and the meaning of belonging.','2017-05-05'],
    ['Spider-Man: Homecoming',2017,3,'Spider-Man|Iron Man','Peter Parker balances school with stopping a dealer in alien weapons.','2017-07-07'],
    ['Thor: Ragnarok',2017,3,'Thor|Loki|Hulk','Thor must escape a distant planet and confront the destruction threatening Asgard.','2017-11-03'],
    ['Black Panther',2018,3,'Black Panther|Shuri','T’Challa faces a challenge to his throne and Wakanda’s place in the world.','2018-02-16'],
    ['Avengers: Infinity War',2018,3,'Iron Man|Captain America|Thor|Doctor Strange|Spider-Man|Thanos','The Avengers and their allies try to prevent Thanos from collecting the Infinity Stones.','2018-04-27'],
    ['Ant-Man and the Wasp',2018,3,'Ant-Man|Wasp','Scott Lang and Hope van Dyne attempt a rescue from the Quantum Realm.','2018-07-06'],
    ['Captain Marvel',2019,3,'Captain Marvel|Nick Fury','Carol Danvers uncovers her past amid an interstellar conflict.','2019-03-08'],
    ['Avengers: Endgame',2019,3,'Iron Man|Captain America|Thor|Hulk|Black Widow|Hawkeye|Ant-Man','The surviving Avengers attempt to undo the devastation caused by Thanos.','2019-04-26'],
    ['Spider-Man: Far From Home',2019,3,'Spider-Man|Nick Fury','Peter Parker’s school trip becomes entangled with a mysterious new hero.','2019-07-02'],
    ['Black Widow',2021,4,'Black Widow|Yelena Belova|Red Guardian','Natasha Romanoff reunites with her former family to confront the Red Room.','2021-07-09'],
    ['Shang-Chi and the Legend of the Ten Rings',2021,4,'Shang-Chi','Shang-Chi confronts his father and the legacy of the Ten Rings.','2021-09-03'],
    ['Eternals',2021,4,'Eternals','Ancient protectors reunite to question the purpose of their mission on Earth.','2021-11-05'],
    ['Spider-Man: No Way Home',2021,4,'Spider-Man|Doctor Strange','A spell meant to restore Peter Parker’s privacy brings visitors from other universes.','2021-12-17'],
    ['Doctor Strange in the Multiverse of Madness',2022,4,'Doctor Strange|Scarlet Witch|America Chavez','Doctor Strange protects a traveler who can cross between universes.','2022-05-06'],
    ['Thor: Love and Thunder',2022,4,'Thor|Mighty Thor','Thor reunites with Jane Foster while confronting a killer of gods.','2022-07-08'],
    ['Black Panther: Wakanda Forever',2022,4,'Shuri|Black Panther|Namor','Wakanda grieves its king while facing a conflict with an underwater nation.','2022-11-11'],
    ['Ant-Man and the Wasp: Quantumania',2023,5,'Ant-Man|Wasp|Kang','Scott Lang’s family is drawn into the Quantum Realm and its struggles for power.','2023-02-17'],
    ['Guardians of the Galaxy Vol. 3',2023,5,'Star-Lord|Gamora|Rocket|Groot|Drax','The Guardians confront Rocket’s past in a race to save his life.','2023-05-05'],
    ['The Marvels',2023,5,'Captain Marvel|Ms. Marvel|Monica Rambeau','Three heroes find their light-based powers unexpectedly linked.','2023-11-10'],
    ['Deadpool & Wolverine',2024,5,'Deadpool|Wolverine','Wade Wilson joins a Wolverine variant on a mission involving the Time Variance Authority.','2024-07-26'],
    ['Captain America: Brave New World',2025,5,'Captain America|Falcon|Hulk','Sam Wilson investigates an international crisis as the new Captain America.','2025-02-14'],
    ['Thunderbolts*',2025,5,'Yelena Belova|Bucky Barnes|Red Guardian|U.S. Agent|Ghost|Sentry','A group of isolated operatives is forced to work together after a deadly trap.','2025-05-02'],
    ['The Fantastic Four: First Steps',2025,6,'Fantastic Four|Mister Fantastic|Invisible Woman|Human Torch|The Thing','The Fantastic Four defend their world against Galactus and his herald.','2025-07-25']
  ].forEach(args => movie(...args));
  function cross(title, year, universe, category) {
    const t = byId.get(slug(title) + '-' + year);
    if (!t.universes.includes(universe)) t.universes.push(universe);
    if (!t.categories.includes(category)) t.categories.push(category);
    return t;
  }
  cross('Deadpool & Wolverine',2024,'X-Men','xmen-movies').continuity = 'MCU multiverse crossover with the Fox X-Men legacy; one shared watch record.';
  ['Homecoming','Far From Home','No Way Home'].forEach((part,i) => cross('Spider-Man: '+part,[2017,2019,2021][i],'Spider-Man','spider-movies'));
  cross('The Fantastic Four: First Steps',2025,'Fantastic Four','fantastic').continuity = 'An alternate Earth within the MCU multiverse, separate from the 2005 and 2015 films.';
  function films(category, universe, group, continuity, rows) {
    rows.forEach(([title,year,characters,synopsis]) => add({id:slug(title)+'-'+year,title,year,type:'movie',
      categories:[category],universes:[universe],group,characters:characters.split('|'),synopsis,continuity}));
  }
  films('xmen-movies','X-Men','Fox X-Men','Fox X-Men continuity; the films include revised timelines and alternate futures.',[
    ['X-Men',2000,'Wolverine|Professor X|Magneto|Jean Grey|Cyclops|Storm','Wolverine and Rogue encounter rival mutant groups with different visions for coexistence.'],
    ['X2: X-Men United',2003,'Wolverine|Professor X|Magneto|Jean Grey|Nightcrawler','The X-Men face a military campaign against mutants.'],
    ['X-Men: The Last Stand',2006,'Wolverine|Jean Grey|Magneto|Storm','A proposed cure for mutation divides the mutant community.'],
    ['X-Men Origins: Wolverine',2009,'Wolverine|Deadpool','Logan’s early life leads him into the Weapon X program.'],
    ['X-Men: First Class',2011,'Professor X|Magneto|Mystique','Charles Xavier and Erik Lehnsherr assemble young mutants during the Cold War.'],
    ['The Wolverine',2013,'Wolverine','Logan travels to Japan and confronts questions about his mortality.'],
    ['X-Men: Days of Future Past',2014,'Wolverine|Professor X|Magneto|Mystique','The X-Men send Wolverine into the past to avert a catastrophic future.'],
    ['Deadpool',2016,'Deadpool','Wade Wilson seeks revenge after an experiment gives him extraordinary healing abilities.'],
    ['X-Men: Apocalypse',2016,'Professor X|Magneto|Jean Grey|Cyclops|Storm','Young X-Men confront an ancient mutant intent on reshaping the world.'],
    ['Logan',2017,'Wolverine|Professor X|X-23','An aging Logan protects a young mutant in a bleak future.'],
    ['Deadpool 2',2018,'Deadpool|Cable|Domino','Deadpool assembles allies to protect a young mutant from a time-traveling soldier.'],
    ['X-Men: Dark Phoenix',2019,'Jean Grey|Professor X|Magneto|Cyclops','Jean Grey struggles with a cosmic force that threatens her relationships and control.'],
    ['The New Mutants',2020,'Magik|Wolfsbane','Young mutants held in a remote facility confront their fears and the institution’s secrets.']
  ]);
  films('spider-movies','Spider-Man','Tobey Maguire','Sam Raimi’s Spider-Man film continuity; distinct from the main MCU timeline.',[
    ['Spider-Man',2002,'Spider-Man|Green Goblin','Peter Parker gains spider powers and faces the Green Goblin.'],
    ['Spider-Man 2',2004,'Spider-Man|Doctor Octopus','Peter Parker struggles with responsibility as Doctor Octopus threatens New York.'],
    ['Spider-Man 3',2007,'Spider-Man|Venom|Sandman','A mysterious symbiote amplifies Peter Parker’s darker impulses.']
  ]);
  films('spider-movies','Spider-Man','Andrew Garfield','The Amazing Spider-Man film continuity; separate from the Raimi films and MCU.',[
    ['The Amazing Spider-Man',2012,'Spider-Man|Lizard','Peter Parker investigates his family’s past and battles the Lizard.'],
    ['The Amazing Spider-Man 2',2014,'Spider-Man|Electro|Green Goblin','Peter faces new enemies while trying to protect his relationship with Gwen Stacy.']
  ]);
  films('spider-movies','Spider-Man','Animated Spider-Verse','Sony’s animated Spider-Verse multiverse; not the main MCU timeline.',[
    ['Spider-Man: Into the Spider-Verse',2018,'Spider-Man|Miles Morales|Spider-Gwen','Miles Morales meets Spider-heroes from other dimensions while learning to use his powers.'],
    ['Spider-Man: Across the Spider-Verse',2023,'Spider-Man|Miles Morales|Spider-Gwen','Miles Morales discovers a society of Spider-heroes with a conflicting view of destiny.']
  ]);
  films('fantastic','Fantastic Four','Legacy Fantastic Four','The 2005 and 2007 films share a continuity; the 2015 film is a separate reboot.',[
    ['Fantastic Four',2005,'Fantastic Four|Doctor Doom','Four explorers gain unusual powers after exposure to cosmic energy.'],
    ['Fantastic Four: Rise of the Silver Surfer',2007,'Fantastic Four|Silver Surfer','The team investigates a cosmic visitor who heralds a danger to Earth.'],
    ['Fantastic Four',2015,'Fantastic Four|Doctor Doom','A dimensional experiment transforms four young people and changes their future.']
  ]);
  films('sony','Sony','Sony Spider-Man Universe','Sony’s live-action Marvel adaptations; do not assume every film shares the MCU timeline.',[
    ['Venom',2018,'Venom','Journalist Eddie Brock becomes the host of an alien symbiote.'],
    ['Venom: Let There Be Carnage',2021,'Venom|Carnage','Eddie Brock and Venom confront a dangerous new symbiote.'],
    ['Morbius',2022,'Morbius','A scientist’s attempt to treat his blood disorder gives him vampiric abilities.'],
    ['Madame Web',2024,'Madame Web','A paramedic with emerging visions tries to protect three young women.'],
    ['Venom: The Last Dance',2024,'Venom','Eddie Brock and Venom go on the run as threats pursue them.'],
    ['Kraven the Hunter',2024,'Kraven','A hunter’s troubled family history shapes his violent path.']
  ]);
  films('other-movies','Other Marvel','Blade','The original Blade film trilogy has its own continuity.',[
    ['Blade',1998,'Blade','A half-vampire hunter fights a conspiracy within vampire society.'],
    ['Blade II',2002,'Blade','Blade reluctantly allies with vampires against a new predator.'],
    ['Blade: Trinity',2004,'Blade','Blade joins other hunters to confront a resurrected vampire threat.']
  ]);
  films('other-movies','Other Marvel','Ghost Rider','The Nicolas Cage Ghost Rider films are separate from the main MCU.',[
    ['Ghost Rider',2007,'Ghost Rider','A stunt rider becomes the supernatural enforcer of a demonic bargain.'],
    ['Ghost Rider: Spirit of Vengeance',2011,'Ghost Rider','Johnny Blaze takes a mission to protect a boy from a demonic threat.']
  ]);
  byId.get('ghost-rider-spirit-of-vengeance-2011').continuity += ' First screened in 2011; general theatrical release followed in 2012.';
  films('other-movies','Other Marvel','Standalone adaptations','A legacy Marvel adaptation outside the main MCU; related names do not imply shared continuity.',[
    ['Howard the Duck',1986,'Howard the Duck','An alien duck is transported to Earth and becomes caught in a cosmic crisis.'],
    ['The Punisher',1989,'Punisher','Frank Castle wages a vigilante campaign against organized crime.'],
    ['Hulk',2003,'Hulk','Bruce Banner’s research and family history become entwined with a monstrous transformation.'],
    ['Daredevil',2003,'Daredevil|Kingpin|Elektra','Blind attorney Matt Murdock fights organized crime as a masked vigilante.'],
    ['Elektra',2005,'Elektra','An assassin turns against her assignment to protect a father and daughter.'],
    ['The Punisher',2004,'Punisher','Frank Castle seeks vengeance after his family is murdered.'],
    ['Punisher: War Zone',2008,'Punisher','Frank Castle’s vigilante war creates a ruthless new adversary.']
  ]);
  function show(name, years, categoriesList, universes, group, characters, synopsis, continuity, options) {
    years.forEach((year,index) => {
      const season = index+1;
      const extra = options && options[season] || {};
      add(Object.assign({id:slug(name)+'-s'+season,title:name+' — Season '+season,series:name,season,year,
        type:'tv',categories:categoriesList.slice(),universes:universes.slice(),group,characters:characters.split('|'),synopsis,continuity},extra));
    });
  }
  const legacy = 'Legacy Marvel Television; MCU connections exist, but later stories may diverge from the film timeline.';
  const mcu = 'Marvel Cinematic Universe live-action television.';
  show('Agents of S.H.I.E.L.D.',[2013,2014,2015,2016,2017,2019,2020],['mcu-tv'],['MCU'],'Legacy television','Phil Coulson|Quake','Phil Coulson’s agents investigate extraordinary threats and hidden conspiracies.',legacy);
  show('Agent Carter',[2015,2016],['mcu-tv'],['MCU'],'Legacy television','Peggy Carter','Peggy Carter undertakes dangerous missions in postwar America.',legacy);
  show('Inhumans',[2017],['mcu-tv'],['MCU'],'Legacy television','Black Bolt|Medusa','Attilan’s royal family is divided by a struggle for power.',legacy);
  show('WandaVision',[2021],['mcu-tv'],['MCU'],'Phase 4','Scarlet Witch|Vision|Monica Rambeau','Wanda and Vision’s suburban life conceals a growing mystery.',mcu,{1:{phase:4,date:'2021-01-15'}});
  show('The Falcon and the Winter Soldier',[2021],['mcu-tv'],['MCU'],'Phase 4','Falcon|Captain America|Bucky Barnes|U.S. Agent','Sam Wilson and Bucky Barnes confront the legacy of Captain America.',mcu,{1:{phase:4,date:'2021-03-19'}});
  show('Loki',[2021,2023],['mcu-tv'],['MCU'],'Multiverse Saga','Loki|Kang','A Loki variant becomes entangled with the Time Variance Authority.', 'MCU multiverse story following a variant created during Avengers: Endgame.',{1:{phase:4,date:'2021-06-09'},2:{phase:5,date:'2023-10-05'}});
  show('What If...?',[2021,2023,2024],['mcu-tv'],['MCU'],'Multiverse animation','The Watcher|Captain Carter','The Watcher explores alternate versions of familiar Marvel events.','Animated alternate realities within the MCU multiverse.',{1:{phase:4},2:{phase:5},3:{phase:5}});
  show('Hawkeye',[2021],['mcu-tv'],['MCU'],'Phase 4','Hawkeye|Kate Bishop|Yelena Belova','Clint Barton and Kate Bishop face trouble in New York during the holidays.',mcu,{1:{phase:4}});
  show('Moon Knight',[2022],['mcu-tv'],['MCU'],'Phase 4','Moon Knight','A man with dissociative identities is drawn into a conflict involving Egyptian gods.',mcu,{1:{phase:4}});
  show('Ms. Marvel',[2022],['mcu-tv'],['MCU'],'Phase 4','Ms. Marvel','Kamala Khan discovers powers connected to her family’s history.',mcu,{1:{phase:4}});
  show('I Am Groot',[2022,2023],['mcu-tv'],['MCU'],'Animated shorts','Groot','Baby Groot encounters small adventures and unexpected mishaps.','Animated Groot shorts; best treated as light companion viewing.');
  show('She-Hulk: Attorney at Law',[2022],['mcu-tv'],['MCU'],'Phase 4','She-Hulk|Hulk|Daredevil','Jennifer Walters balances legal work with her new Hulk abilities.',mcu,{1:{phase:4}});
  show('Secret Invasion',[2023],['mcu-tv'],['MCU'],'Phase 5','Nick Fury','Nick Fury investigates a covert Skrull threat on Earth.',mcu,{1:{phase:5}});
  show('Echo',[2024],['mcu-tv'],['MCU'],'Phase 5','Echo|Kingpin|Daredevil','Maya Lopez returns home while confronting the consequences of her criminal past.',mcu,{1:{phase:5}});
  show("X-Men '97",[2024,2026],['mcu-tv','xmen-tv'],['X-Men'],'Marvel Animation','Cyclops|Jean Grey|Storm|Wolverine|Magneto','The X-Men carry on their mission amid threats to mutant coexistence.','Continuation of X-Men: The Animated Series; not the main MCU timeline.',{2:{release:'unconfirmed',categories:['mcu-tv','xmen-tv','upcoming'],continuity:'Continuation of the 1990s animated series. Season 2 is announced; premiere status was not verified in this catalogue review.'}});
  show('Agatha All Along',[2024],['mcu-tv'],['MCU'],'Phase 5','Agatha Harkness','Agatha assembles a coven to seek power along the Witches’ Road.',mcu,{1:{phase:5}});
  show('Your Friendly Neighborhood Spider-Man',[2025,null],['mcu-tv','spider-tv'],['Spider-Man'],'Marvel Animation','Spider-Man','Peter Parker navigates teenage life and the responsibilities of becoming Spider-Man.','A separate animated continuity, not Tom Holland’s MCU history.',{2:{release:'unconfirmed',categories:['mcu-tv','spider-tv','upcoming'],continuity:'An announced second season in a separate animated continuity; its current premiere date awaits primary-source verification.'}});
  show('Daredevil: Born Again',[2025,2026],['mcu-tv','defenders'],['MCU','Defenders'],'Marvel Television','Daredevil|Kingpin|Punisher','Matt Murdock and Wilson Fisk renew their conflict over New York.', 'MCU continuation of the street-level story established in Daredevil.',{1:{phase:5},2:{date:'2026-03-24'}});
  show('Marvel Zombies',[2025],['mcu-tv'],['MCU'],'Marvel Animation','Ms. Marvel|Shang-Chi','Survivors face a world devastated by superpowered zombies.','Alternate-universe animation linked to the zombie concept introduced in What If...?.');
  show('Wonder Man',[2026],['mcu-tv'],['MCU'],'Marvel Television','Wonder Man','Simon Williams pursues an acting career in Hollywood.',mcu);
  add({id:'visionquest',title:'VisionQuest',series:'VisionQuest',year:2026,date:'2026-10-14',type:'tv',categories:['mcu-tv','upcoming'],universes:['MCU'],group:'Marvel Television',characters:['Vision'],synopsis:'Vision returns in a series exploring his next chapter.',continuity:'MCU follow-up to WandaVision. October 14, 2026 was announced as its premiere; actual availability has not been independently verified, so release status remains unconfirmed.',release:'unconfirmed',sources:['https://www.marvel.com/articles/tv-shows/marvel-television-visionquest-release-date?pubDate=20260513']});
  show('X-Men: The Animated Series',[1992,1993,1994,1995,1996],['xmen-tv'],['X-Men'],'Classic animation','Wolverine|Professor X|Cyclops|Jean Grey|Storm|Magneto','The X-Men protect a world that fears mutants.','The original animated continuity continued by X-Men ’97.');
  show('X-Men: Evolution',[2000,2001,2002,2003],['xmen-tv'],['X-Men'],'Animation','Wolverine|Professor X|Cyclops|Jean Grey','Young mutants learn to control their abilities while attending school.','A separate animated X-Men continuity.');
  show('Wolverine and the X-Men',[2009],['xmen-tv'],['X-Men'],'Animation','Wolverine|Professor X|Cyclops|Jean Grey','Wolverine reunites the X-Men after a catastrophe.','A separate animated X-Men continuity.');
  show('Legion',[2017,2018,2019],['xmen-tv'],['X-Men'],'Live-action alternatives','Legion','David Haller discovers that his experiences may be connected to mutant powers.','A distinct live-action continuity inspired by the X-Men comics.');
  show('The Gifted',[2017,2018],['xmen-tv'],['X-Men'],'Live-action alternatives','Polaris|Blink|Thunderbird','A family joins a mutant underground while fleeing persecution.','An alternate live-action X-Men setting, separate from the main film sequence.');
  show('Marvel Anime: X-Men',[2011],['xmen-tv'],['X-Men'],'Marvel Anime','Cyclops|Wolverine|Storm','The X-Men travel to Japan to investigate missing mutants.','Marvel Anime adaptation with its own continuity.');
  [
    ['Spider-Man',1967,'Spider-Man','Peter Parker fights villains in his first animated television adaptation.'],
    ['Spider-Man',1981,'Spider-Man','Peter Parker balances ordinary life with animated superhero adventures.'],
    ['Spider-Man and His Amazing Friends',1981,'Spider-Man|Iceman|Firestar','Spider-Man teams with Iceman and Firestar to fight crime.'],
    ['Spider-Man: The Animated Series',1994,'Spider-Man','Peter Parker confronts familiar villains across the 1990s animated series.'],
    ['Spider-Man Unlimited',1999,'Spider-Man','Spider-Man travels to Counter-Earth and becomes involved in its resistance.'],
    ['Spider-Man: The New Animated Series',2003,'Spider-Man','Peter Parker juggles college and crime-fighting in a computer-animated series.'],
    ['The Spectacular Spider-Man',2008,'Spider-Man','A teenage Peter Parker learns to balance friendships, school and superhero duties.'],
    ['Ultimate Spider-Man',2012,'Spider-Man|Nick Fury','Spider-Man trains alongside other young heroes under S.H.I.E.L.D. guidance.'],
    ["Marvel's Spider-Man",2017,'Spider-Man','Peter Parker studies science and learns to be a superhero.'],
    ['Spidey and His Amazing Friends',2021,'Spider-Man|Miles Morales|Spider-Gwen','Young Spider-heroes work together in adventures for preschool audiences.']
  ].forEach(([title,year,characters,synopsis]) => add({id:slug(title)+'-tv-'+year,title,series:title,year,type:'tv',categories:['spider-tv'],universes:['Spider-Man'],group:'Spider-Man animation',characters:characters.split('|'),synopsis,continuity:'Separate animated adaptation; this record tracks the whole series, not an invented season count.'}));
  const defenders = 'The Defenders Saga; shared street-level continuity later continued by MCU television.';
  show('Daredevil',[2015,2016,2018],['defenders'],['Defenders','MCU'],'Netflix / Defenders','Daredevil|Kingpin|Elektra|Punisher','Matt Murdock protects Hell’s Kitchen as an attorney and masked vigilante.',defenders);
  show('Jessica Jones',[2015,2018,2019],['defenders'],['Defenders','MCU'],'Netflix / Defenders','Jessica Jones','A superpowered private investigator confronts dangerous cases and personal trauma.',defenders);
  show('Luke Cage',[2016,2018],['defenders'],['Defenders','MCU'],'Netflix / Defenders','Luke Cage','An unbreakable man becomes a protector of Harlem.',defenders);
  show('Iron Fist',[2017,2018],['defenders'],['Defenders','MCU'],'Netflix / Defenders','Iron Fist|Colleen Wing','Danny Rand returns to New York with the power of the Iron Fist.',defenders);
  show('The Defenders',[2017],['defenders'],['Defenders','MCU'],'Netflix / Defenders','Daredevil|Jessica Jones|Luke Cage|Iron Fist','Four New York heroes unite against the Hand.',defenders);
  show('The Punisher',[2017,2019],['defenders'],['Defenders','MCU'],'Netflix / Defenders','Punisher','Frank Castle investigates conspiracies through a violent pursuit of justice.',defenders);
  add({id:'the-punisher-one-last-kill-2026',title:'The Punisher: One Last Kill',year:2026,date:'2026-05-12',type:'tv',categories:['defenders','mcu-tv'],universes:['MCU','Defenders'],group:'Special Presentation',characters:['Punisher'],synopsis:'Frank Castle returns in a Marvel Television special presentation.',continuity:'MCU street-level special connected to the Punisher and Daredevil stories.',sources:['https://www.marvel.com/tv-shows/']});
  show('Cloak & Dagger',[2018,2019],['other-tv'],['Other Marvel'],'Legacy television','Cloak|Dagger','Two teenagers discover that their extraordinary abilities are connected.', 'Legacy Marvel Television with ties to Runaways; do not assume all later MCU events align.');
  show('Runaways',[2017,2018,2019],['other-tv'],['Other Marvel'],'Legacy television','Runaways','Teenagers discover their parents belong to a dangerous organization.','Legacy Marvel Television with a Cloak & Dagger crossover.');
  show('Hit-Monkey',[2021,2024],['other-tv'],['Other Marvel'],'Adult animation','Hit-Monkey','A Japanese snow monkey enters the world of assassins with a ghostly companion.','Standalone adult animated continuity.');
  show('M.O.D.O.K.',[2021],['other-tv'],['Other Marvel'],'Adult animation','M.O.D.O.K.','A supervillain struggles with family life and control of his organization.','Standalone adult animated comedy.');
  show('Moon Girl and Devil Dinosaur',[2023,2024],['other-tv'],['Other Marvel'],'Animation','Moon Girl|Devil Dinosaur','Young inventor Lunella Lafayette teams up with a dinosaur to protect her neighborhood.','Separate animated continuity.');
  show("The Avengers: Earth's Mightiest Heroes",[2010,2012],['other-tv'],['Other Marvel'],'Animation','Iron Man|Captain America|Thor|Hulk|Wasp|Ant-Man','Earth’s heroes assemble to battle threats too great for any one hero.','An independent animated Avengers continuity.');
  show('Avengers Assemble',[2013,2014,2016,2017,2018],['other-tv'],['Other Marvel'],'Animation','Iron Man|Captain America|Thor|Hulk|Black Panther','The Avengers defend Earth against powerful enemies.','An animated Avengers continuity separate from the live-action MCU.');
  show('Guardians of the Galaxy (animated)',[2015,2017,2018],['other-tv'],['Other Marvel'],'Animation','Star-Lord|Gamora|Rocket|Groot|Drax','The Guardians explore cosmic mysteries and protect the galaxy.','Animated adaptation distinct from the live-action Guardians films.');
  add({id:'agents-of-shield-slingshot',title:'Agents of S.H.I.E.L.D.: Slingshot',year:2016,type:'tv',categories:['other-tv','mcu-tv'],universes:['MCU'],group:'Legacy television',characters:['Yo-Yo|Quake'],synopsis:'Elena Rodriguez undertakes a mission involving her past.',continuity:'A short-form companion to Agents of S.H.I.E.L.D.'});
  [
    ['Marvel Rising: Initiation',2018,'Ghost-Spider encounters other young heroes during a pursuit.'],
    ['Marvel Rising: Secret Warriors',2018,'Young heroes unite to protect people with extraordinary abilities.'],
    ['Marvel Rising: Chasing Ghosts',2019,'Ghost-Spider teams up with the Secret Warriors against a dangerous threat.'],
    ['Marvel Rising: Heart of Iron',2019,'Riri Williams becomes involved with the Secret Warriors.'],
    ['Marvel Rising: Battle of the Bands',2019,'Ghost-Spider balances a musical performance with superhero responsibilities.'],
    ['Marvel Rising: Operation Shuri',2019,'Shuri visits the Secret Warriors for a new adventure.'],
    ['Marvel Rising: Playing with Fire',2019,'Inferno and the Secret Warriors face a challenge involving his powers.']
  ].forEach(([title,year,synopsis]) => add({id:slug(title),title,series:'Marvel Rising',year,type:'tv',categories:['other-tv'],universes:['Other Marvel'],group:'Marvel Rising',characters:['Ms. Marvel','Squirrel Girl','Ghost-Spider'],synopsis,continuity:'Marvel Rising animated continuity; each shorts collection or special is tracked once.'}));
  show('The Super Hero Squad Show',[2009,2010],['other-tv'],['Other Marvel'],'Animation','Iron Man|Hulk|Thor|Wolverine','Superheroes protect Super Hero City in comedic animated adventures.','Standalone comedy continuity. “Marvel Super Hero Squad” is an alias, not an extra show.',{1:{aliases:['Marvel Super Hero Squad']},2:{aliases:['Marvel Super Hero Squad']}});
  [
    ['Avengers: Doomsday',2026,'2026-12-18','upcoming','An announced Marvel Studios Avengers film scheduled for December 2026.','https://movies.disney.com/avengers-doomsday'],
    ['Avengers: Secret Wars',2027,null,'upcoming','An announced Avengers film following Avengers: Doomsday.','https://www.marvel.com/movies/avengers-secret-wars'],
    ['Spider-Man: Brand New Day',2026,'2026-07-31','released','Peter Parker faces a new chapter after the events of No Way Home.','https://www.sonypictures.com/movies/spidermanbrandnewday']
  ].forEach(([title,year,date,release,synopsis,source]) => add({id:slug(title)+'-'+year,title,year,date,release,type:'movie',phase:6,categories:['upcoming'],universes:['MCU'],group:'Phase 6 / release watch',characters:title.startsWith('Spider-Man')?['Spider-Man']:['Avengers'],synopsis,continuity:release==='released'?'Verified released by Sony; retained in the requested release-watch collection. Personal progress is never set automatically.':'Announced MCU project. Dates may change; plot details are not assumed.',sources:[source]}));
  const brandNewDay = byId.get('spider-man-brand-new-day-2026');
  brandNewDay.categories.push('spider-movies'); brandNewDay.universes.push('Spider-Man');
  const essentials = [
    'x-men-2000','x2-x-men-united-2003','x-men-first-class-2011','x-men-days-of-future-past-2014',
    'deadpool-2016','deadpool-2-2018','avengers-infinity-war-2018','avengers-endgame-2019',
    'wandavision-s1','loki-s1','spider-man-no-way-home-2021','doctor-strange-in-the-multiverse-of-madness-2022',
    'loki-s2','deadpool-wolverine-2024','captain-america-brave-new-world-2025','thunderbolts-2025','the-fantastic-four-first-steps-2025'
  ];
  essentials.forEach((id,index) => { const t=byId.get(id); if (!t) throw new Error('Missing essential: '+id); t.essential=true; t.recommended=index+1; });
  // Related viewing is a navigation aid, not a claim that continuities are identical.
  titles.forEach(t => {
    t.related = titles.filter(other => other.id !== t.id &&
      (t.series ? other.series === t.series : other.characters.some(c => t.characters.includes(c)) && other.universes.some(u => t.universes.includes(u))))
      .slice(0,4).map(other => other.id);
  });
  const artwork = {
    'iron-man-3-2013':'https://upload.wikimedia.org/wikipedia/en/1/19/Iron_Man_3_poster.jpg',
    'thor-the-dark-world-2013':'https://upload.wikimedia.org/wikipedia/en/7/7f/Thor_The_Dark_World_poster.jpg',
    'captain-america-the-winter-soldier-2014':'https://upload.wikimedia.org/wikipedia/en/9/9e/Captain_America_The_Winter_Soldier_poster.jpg',
    'guardians-of-the-galaxy-2014':'https://upload.wikimedia.org/wikipedia/en/3/33/Guardians_of_the_Galaxy_%28film%29_poster.jpg',
    'avengers-age-of-ultron-2015':'https://upload.wikimedia.org/wikipedia/en/f/ff/Avengers_Age_of_Ultron_poster.jpg',
    'ant-man-2015':'https://upload.wikimedia.org/wikipedia/en/1/12/Ant-Man_%28film%29_poster.jpg',
    'captain-america-civil-war-2016':'https://upload.wikimedia.org/wikipedia/en/5/53/Captain_America_Civil_War_poster.jpg',
    'doctor-strange-2016':'https://upload.wikimedia.org/wikipedia/en/a/a1/Doctor_Strange_%282016_film%29_poster.jpg',
    'guardians-of-the-galaxy-vol-2-2017':'https://upload.wikimedia.org/wikipedia/en/3/32/Guardians_of_the_Galaxy_Vol._2_poster.jpg',
    'spider-man-homecoming-2017':'https://upload.wikimedia.org/wikipedia/en/f/f9/Spider-Man_Homecoming_poster.jpg',
    'thor-ragnarok-2017':'https://upload.wikimedia.org/wikipedia/en/7/7d/Thor_Ragnarok_poster.jpg',
    'black-panther-2018':'https://upload.wikimedia.org/wikipedia/en/d/d6/Black_Panther_%28film%29_poster.jpg',
    'ant-man-and-the-wasp-2018':'https://upload.wikimedia.org/wikipedia/en/2/2c/Ant-Man_and_the_Wasp_poster.jpg',
    'captain-marvel-2019':'https://upload.wikimedia.org/wikipedia/en/4/4e/Captain_Marvel_%28film%29_poster.jpg',
    'spider-man-far-from-home-2019':'https://upload.wikimedia.org/wikipedia/en/b/bd/Spider-Man_Far_From_Home_poster.jpg',
    'black-widow-2021':'https://upload.wikimedia.org/wikipedia/en/e/e9/Black_Widow_%282021_film%29_poster.jpg',
    'shang-chi-and-the-legend-of-the-ten-rings-2021':'https://upload.wikimedia.org/wikipedia/en/7/74/Shang-Chi_and_the_Legend_of_the_Ten_Rings_poster.jpeg',
    'eternals-2021':'https://upload.wikimedia.org/wikipedia/en/9/9b/Eternals_%28film%29_poster.jpeg',
    'spider-man-no-way-home-2021':'https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg',
    'doctor-strange-in-the-multiverse-of-madness-2022':'https://upload.wikimedia.org/wikipedia/en/1/17/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg',
    'thor-love-and-thunder-2022':'https://lumiere-a.akamaihd.net/v1/images/pp_thorloveandthunder_herobanner_639_58a4b9bf.jpeg?region=0%2C0%2C2048%2C878',
    'black-panther-wakanda-forever-2022':'https://upload.wikimedia.org/wikipedia/en/3/3b/Black_Panther_Wakanda_Forever_poster.jpg',
    'ant-man-and-the-wasp-quantumania-2023':'https://upload.wikimedia.org/wikipedia/en/3/30/Ant-Man_and_the_Wasp_Quantumania_poster.jpg',
    'guardians-of-the-galaxy-vol-3-2023':'https://upload.wikimedia.org/wikipedia/en/7/74/Guardians_of_the_Galaxy_Vol._3_poster.jpg',
    'the-marvels-2023':'https://upload.wikimedia.org/wikipedia/en/7/7a/The_Marvels_poster.jpg',
    'deadpool-wolverine-2024':'https://upload.wikimedia.org/wikipedia/en/4/4c/Deadpool_%26_Wolverine_poster.jpg',
    'x-men-2000':'https://lumiere-a.akamaihd.net/v1/images/x-men_584x800_a3b88d5a.jpeg?region=0%2C0%2C584%2C800',
    'x2-x-men-united-2003':'https://upload.wikimedia.org/wikipedia/en/3/3e/X2_poster.jpg',
    'x-men-first-class-2011':'https://lumiere-a.akamaihd.net/v1/images/xmen_1st_class_584x800_d0307851.jpeg?region=0%2C0%2C584%2C800',
    'x-men-days-of-future-past-2014':'https://upload.wikimedia.org/wikipedia/en/0/0c/X-Men_Days_of_Future_Past_poster.jpg',
    'deadpool-2016':'https://lumiere-a.akamaihd.net/v1/images/image_8c4aa72b.jpeg?region=0%2C0%2C800%2C1200',
    'deadpool-2-2018':'https://upload.wikimedia.org/wikipedia/en/c/cf/Deadpool_2_poster.jpg',
    'loki-s1':'https://upload.wikimedia.org/wikipedia/en/c/c9/Loki_season_1_poster.jpeg',
    'loki-s2':'https://upload.wikimedia.org/wikipedia/en/4/4b/Loki_season_2_poster.jpg',
    'wandavision-s1':'https://lumiere-a.akamaihd.net/v1/images/br_digital_payoff_keyart_v3_lg_44751099.jpeg?region=0%2C0%2C1688%2C2500',
    'iron-man-2008':'https://upload.wikimedia.org/wikipedia/en/0/02/Iron_Man_%282008_film%29_poster.jpg',
    'the-incredible-hulk-2008':'https://upload.wikimedia.org/wikipedia/en/f/f0/The_Incredible_Hulk_%28film%29_poster.jpg',
    'iron-man-2-2010':'https://upload.wikimedia.org/wikipedia/en/e/ed/Iron_Man_2_poster.jpg',
    'thor-2011':'https://upload.wikimedia.org/wikipedia/en/9/95/Thor_%28film%29_poster.jpg',
    'captain-america-the-first-avenger-2011':'https://upload.wikimedia.org/wikipedia/en/3/37/Captain_America_The_First_Avenger_poster.jpg',
    'the-avengers-2012':'https://upload.wikimedia.org/wikipedia/en/8/8a/The_Avengers_%282012_film%29_poster.jpg',
    'spider-man-brand-new-day-2026':'https://www.sonypictures.com/sites/default/files/styles/max_860x460/public/title-key-art/spidermanbrandnewday_onesheet_1400x2100_1.jpg?itok=hXKCyx3k',
    'avengers-endgame-2019':'https://lumiere-a.akamaihd.net/v1/images/h_avengersendgame_19751_b8067b68.jpeg?region=0%2C0%2C2048%2C878',
    'avengers-infinity-war-2018':'https://lumiere-a.akamaihd.net/v1/images/pp_avengersinfinitywar_herobanner_19871_bd17a892.jpeg?region=0%2C0%2C2048%2C878',
    'the-fantastic-four-first-steps-2025':'https://lumiere-a.akamaihd.net/v1/images/pp_disneymovies_fantasticfourfirststeps_herobanner_41d922ec.jpeg?region=0%2C0%2C2048%2C878',
    'thunderbolts-2025':'https://lumiere-a.akamaihd.net/v1/images/pp_disneymovies_marvelsthunderbolts_herobanner_v1_da93a7ca.jpeg?region=0%2C0%2C2048%2C878',
    'captain-america-brave-new-world-2025':'https://lumiere-a.akamaihd.net/v1/images/pp_disney_captainamerica_bravenewworld_herobanner_3581_2a274287.jpeg?region=0%2C0%2C2048%2C878',
    'avengers-doomsday-2026':'https://lumiere-a.akamaihd.net/v1/images/g_movies_avengersdoomsday_d23update_poster_8c2ab836.jpeg?region=0%2C0%2C1300%2C730'
  };
  Object.entries(artwork).forEach(([id,url]) => { byId.get(id).poster=url; });
  // Shared show artwork identifies a series; the season label remains explicit.
  const seriesArtwork = {
    'Agents of S.H.I.E.L.D.':'https://cdn.marvel.com/content/2x/_shd_photoshop_keyart_vertical.jpg',
    'Agent Carter':'https://upload.wikimedia.org/wikipedia/en/e/eb/Agent_Carter_season_1_poster.jpg',
    'Daredevil':'https://upload.wikimedia.org/wikipedia/en/1/1b/Daredevil_season_1_poster.jpg',
    'Jessica Jones':'https://upload.wikimedia.org/wikipedia/en/c/c1/Jessica_Jones_season_1_poster.jpg',
    'The Punisher':'https://upload.wikimedia.org/wikipedia/en/2/21/The_Punisher_season_1_poster.jpg'
  };
  titles.forEach(t => {
    if (seriesArtwork[t.series]) { t.poster=seriesArtwork[t.series]; t.artworkLabel='Series promotional artwork'; }
    if (t.poster && t.poster.startsWith('https://upload.wikimedia.org/')) {
      const filename=t.poster.slice(t.poster.lastIndexOf('/')+1).split('?')[0];
      t.sources.push('https://en.wikipedia.org/wiki/File:'+filename);
    }
  });
  window.MarvelData = {
    titles, categories, reviewedAt:'2026-10-15', doomsdayDate:'2026-12-18',
    essentialsNote:'A fan-curated recommendation, not an official viewing requirement.',
    accuracyNote:'One record per specified season, film, series collection or special. Release status is editorial metadata, never a personal completion status. Unknown exact dates remain blank. Unverified announced seasons are marked unconfirmed. MCU & Marvel Studios TV includes animation set outside the main MCU timeline.',
    sources:[
      {title:'Marvel official television catalogue',url:'https://www.marvel.com/tv-shows/'},
      {title:'Marvel official movie catalogue',url:'https://www.marvel.com/movies'},
      {title:'Disney: Avengers: Doomsday release date and artwork',url:'https://movies.disney.com/avengers-doomsday'},
      {title:'Sony: Spider-Man: Brand New Day — available at home',url:'https://www.sonypictures.com/movies/spidermanbrandnewday'},
      {title:'Marvel: VisionQuest premiere announcement',url:'https://www.marvel.com/articles/tv-shows/marvel-television-visionquest-release-date?pubDate=20260513'},
      {title:'Disney: Daredevil: Born Again season 2 announcement (UK date)',url:'https://press.disney.co.uk/news/marvel-television-reveals-trailer-%26-key-art-for-the-highly-anticipated-second-season-of-daredevil-born-again'},
      {title:'Disney Movies: official promotional artwork',url:'https://movies.disney.com/avengers-endgame'},
      {title:'Publisher artwork reproduced by Wikipedia (copyright remains with rights holders)',url:'https://en.wikipedia.org/wiki/Category:Marvel_Cinematic_Universe_film_posters'},
      {title:'Marvel: Agents of S.H.I.E.L.D. series artwork',url:'https://www.marvel.com/articles/tv-shows/marvels-agents-of-shield-season-1-refresher'},
      {title:'Disney+: WandaVision press kit',url:'https://press.disneyplus.com/media-kits/wandavision'},
      {title:'20th Century Studios: X-Men artwork',url:'https://www.20thcenturystudios.com/movies/x-men'},
      {title:'20th Century Studios: First Class artwork',url:'https://www.20thcenturystudios.com/movies/x-men-first-class'},
      {title:'20th Century Studios: Deadpool artwork',url:'https://www.20thcenturystudios.com/movies/deadpool'}
    ]
  };
}());
