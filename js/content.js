// ======================================================================
// CONTENT: the pieces in the portfolio and their write-ups. This is the file to edit.
//
// PART 1  PROJECTS: the list of pages, in display order (contents page, Works menu, Previous/Next).
//         ABOUT:    the blurb on the About page (the left page of the opening spread).
// PART 2  DETAILS:  one write-up per project, matched to PROJECTS by id.
// PART 3  Fallback panels, shown for any project that has no DETAILS entry yet.
// ======================================================================

// ---------------------------------------------------------------------
// PART 1: PROJECTS
// ---------------------------------------------------------------------
const PROJECTS = [
  // ---- Works ----
  { id: 'work-1', group: 'Works', no: 'No. 1', title: 'Warner Music Group (Internship)', type: 'Digital Operations, 2026',
    summary: 'Designed and executed various automated workflows for the Digital Specialty Products team to streamline operations, such as focusing on improving efficiency in video claiming for Atlantic Records.' },
  { id: 'work-2', group: 'Works', no: 'No. 2', title: 'Credit Karma Client Project', type: 'Digital Product Design, 2026',
    summary: 'A client project for Intuit on making Credit Karma a weekly money habit for Gen Z, by leading with spending instead of credit.' },
  { id: 'work-3', group: 'Works', no: 'No. 3', title: 'Polaris - FigBuild 2026', type: 'Hackathon, 2026',
    summary: 'Collaborative project addressing how to digitally interpret sensory experiences during the 2026 FigBuild Hackathon.' },
  { id: 'work-4', group: 'Works', no: 'No. 4', title: 'User Research: CradleWave', type: 'Human-Centered Product Design, 2026',
    summary: 'The user research and design process behind CradleWave, an on-land roll-tacking simulation tool for the Northwestern Sailing Team.' },
  { id: 'work-5', group: 'Works', no: 'No. 5', title: 'Glow&Go', type: 'HCI, 2025',
    summary: 'An app and bracelet that show students abroad when their loved ones are free to talk.' },
  { id: 'work-6', group: 'Works', no: 'No. 6', title: 'Data Visualization', type: 'Collection of 3 Projects',
    summary: 'A collection of data visualization projects: an interactive dashboard, a music-industry network analysis, and a study of online news coverage.' },

  // ---- Creatives ----
  { id: 'creative-1', group: 'Creatives', no: 'I.', title: 'Live Concert Photography', type: 'Photography',
    summary: 'A collection of photos captured during live music performances I’ve attended.' },
  { id: 'creative-2', group: 'Creatives', no: 'II.', title: 'Digital Fashion and the Body', type: 'Fashion Design & Art Direction',
    summary: 'Three-garment series exploring the abstract relationship between time and physical form.' },
  { id: 'creative-3', group: 'Creatives', no: 'III.', title: 'Magazine Templates and Layouts', type: 'Graphic Design',
    summary: 'Experimental compositions built around rhythm, typography, and contrast.' },
  { id: 'creative-4', group: 'Creatives', no: 'IV.', title: 'Film Analysis', type: 'Cinema',
    summary: 'Analysis of narrative techniques and visual storytelling in contemporary cinema.' }
];

// About: the right page of the landing spread, centred. Each item in `paragraphs` is a paragraph;
// set in justified text with a little space between. Keep it short so it fits without scrolling.
const ABOUT = {
  title: 'About',
  paragraphs: [
    'Hello, my name is Hyouji (or Sally) Joo. I’d like to describe myself as a data-driven thinker with a creative heart and a passion for empathetic design. I love finding the stories behind numbers, understanding how people think, and translating abstract ideas into intuitive, meaningful, and empathetic digital experiences.',
    'Beyond design, I am a music enthusiast (as you can see from the music score page design), art lover, and a hobby collector.',
    'I think of the music score as a metaphor for how projects of different natures can form a cohesive story, similar to how there are multiple movements in a musical piece.'
  ]
};

// ---------------------------------------------------------------------
// PART 2: DETAILS
// Declared ONCE here. Every project below is added with DETAILS['id'] = { ... }.
// A project with no entry shows its summary plus the process-led fallback panels (Part 3).
//
// Each panel is either a section { h: 'Heading', p: ['paragraph', ...], list: [...], facts: [[label, value], ...] }
// or a picture { fig: 'Label', cap: 'Caption', src: 'images/...', alt: '...' }.
//
// THE LEFT PAGE stays put while the write-up scrolls. It shows the title, the type, the number, the project's facts
// and the introduction (the lede, or the summary). The facts come from:
//   info: [['Role', '...'], ['Timing', '...']]       on the write-up, if given; otherwise
//   the `facts` of the panel headed "Project overview", plus any short "Label: value" lines in its paragraphs.
// Those facts are taken out of the write-up on the right, so nothing is said twice.
//
// PICTURES appear as previews when you point at a highlighted term, like the link previews on Wikipedia:
//   { fig: 'System wireframe', cap: '...', src: 'images/wmg/wireframe.png', alt: '...' }
//        becomes a highlighted line in the write-up; point at it to see the picture.
//   { figs: [ {...}, {...} ] }        a few pictures: one highlighted name each. Many pictures (a gallery):
//                                     one highlighted line, previewing them all as a contact sheet.
//   { h: 'Heading', p: [...], src: 'images/....png', alt: '...' }      the heading itself is highlighted.
//   Inside any paragraph: 'We tested the {{first prototype|images/cradlewave/proto.jpg|The first prototype}} on the dock.'
//        highlights "first prototype" and previews that picture with that caption.
//   cover: 'images/....jpg'          on the write-up: pointing at the title on the left page previews it.
//   embed: 'https://...'             on the write-up or a section: a "live site" link that previews the site.
// Pictures are shown in full colour in the preview; the pages themselves stay monochrome.
//
// FOLDS (dropdowns): { h, fold: true, p: [summary that always shows], open: false, panels: [sections inside] }.
// Write each section as evidence for a decision: what you observed, how you tested it, and what you changed because of it.
// Short lines at the start of a section (like "Team of 5") are set as a small list of facts.
// ---------------------------------------------------------------------
const DETAILS = {};

// Concert photos are kept in artist folders and listed in display order.
const CONCERT_PHOTO_GROUPS = [
  {
    artist: 'Men I Trust',
    folder: 'm',
    files: ['mit.JPEG', 'mit1.JPEG', 'mit_1.JPEG', 'mit2.JPEG', 'mit3.JPEG', 'mit4.JPEG', 'mit5.JPEG', 'mit6.JPEG',
            'mit7.JPEG', 'mit9.JPEG', 'mit10.JPEG', 'mit12.JPEG'],
    grid: true          // shown right on the page as a grid of large photos
  },
  {
    artist: 'Suki Waterhouse',
    folder: 'sw',
    files: ['sw.jpg', 'sw1.jpg', 'sw2.JPG', 'sw3.JPG', 'sw4.JPG', 'sw5.JPG', 'sw6.JPG', 'sw7.JPG', 'sw8.JPG', 'sw9.JPG',
            'sw10.JPG', 'sw11.JPG', 'sw12.JPG', 'sw13.JPG'],
    grid: true          // shown right on the page as a grid of large photos
  },
  {
    artist: 'Dominic Fike',
    folder: 'df',
    files: Array.from({ length: 9 }, (_, i) => `df${i + 1}.JPG`),
    grid: true          // shown right on the page as a grid of large photos
  },
  {
    artist: 'Smashing Pumpkins',
    folder: 'sp',
    files: ['sp1.JPG', 'sp2.JPG', 'sp3.JPG'],
    grid: true          // shown right on the page as a grid of large photos
  },
  {
    artist: 'BOYNEXTDOOR',
    folder: 'bnd',
    files: ['bnd.JPG', 'bnd1.JPG', 'bnd2.JPG', 'bnd4.JPG', 'bnd5.JPG', 'bnd6.JPG', 'bnd7.JPG', 'bnd8.JPG', 'bnd9.JPG', 'bnd10.JPG'],
    grid: true          // shown right on the page as a grid of large photos (leave out to show "View the photos" instead)
  }
];

// Digital Fashion and the Body: the article, then a link to the magazine (a PDF), then each garment's pictures
// shown together as a grid of whole (uncropped) images, two per row. Pictures live in images/body/, named by number.
const BODY_GROUPS = [
  { h: 'Physical Time: The Spine', note: '6 photos', folder: 'spine', files: ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png'] },
  { h: 'Subjective Time: The Heart', note: '5 photos', folder: 'heart', files: ['1.png', '2.png', '3.png', '4.png', '5.png'] },
  { h: 'Reactive Time', note: '2 photos', folder: '', files: ['f1.png', 'f2.png'] }
];

// An artist with more photos than this is split in two parts. Each part previews as its own contact sheet.
// (Infinity keeps every artist's photos together in one preview.)
const PHOTOS_PER_POPUP = Infinity;

DETAILS['creative-1'] = {
  cover: 'images/concert_photos/m/mit.JPEG',
  panels: CONCERT_PHOTO_GROUPS.flatMap(({ artist, folder, files, grid }, n) => {
    // all of an artist's photos in one group each: they sit next to each other (a grid) instead of in a long column
    const photos = files.map((file, i) => ({
      fig: `${artist} — Photo ${i + 1}`,
      cap: '',
      src: `images/concert_photos/${folder}/${file}`,
      alt: `${artist} concert photograph ${i + 1}`
    }));
    const half = Math.ceil(photos.length / 2);
    const parts = photos.length > PHOTOS_PER_POPUP ? [photos.slice(0, half), photos.slice(half)] : [photos];
    let from = 1;
    return parts.flatMap((part, k) => {
      const to = from + part.length - 1;
      const head = k === 0
        ? { h: artist, p: [`${photos.length} concert photos`, ...(parts.length > 1 ? [`Photos ${from}–${to}`] : [])] }
        : { h: `${artist}, continued`, p: [`Photos ${from}–${to}`] };
      from = to + 1;
      // a dropdown with a line of the music above it: the photos stay closed until it's opened
      return [{ h: head.h, fold: true, open: false, bar: n + 1, p: head.p, panels: [{ figs: part, grid: !!grid }] }];   // the music carries on from the line at the top
    });
  })
};

DETAILS['creative-2'] = {
  cover: 'images/body/magazine/1.png',
  panels: [
    { h: 'The Chronology of the Disobedient Body', p: [
        'Reflecting on my decision to first join this digital fashion course, the primary driver of this decision was my passion for design. Of course, in this case, design refers to fashion design and 3D prototyping design, but the concept of design is truly a broad spectrum that has captivated me since a young age. As a child, I breezed past dozens of potential careers, ranging from wanting to be an artist, a fashion designer, to a composer; the key similarity between all these careers being the subject of “design.” Referencing the interview with Lucy McRae discussing the role of technology in her inspiration for fashion, I would describe myself as a designer who patches the gap between abstract notions and digital representation.',
        'My three-garment series is titled “The Chronology of the Disobedient Body,” the idea derived from medical articles explaining how the body’s perception of time is not a consistent element. To briefly contextualize, the physiological perception of time is highly dependent on different psychological and physical factors that influence signals distributed across the brain networks; this is reflected in how certain disorders that impact a person’s body physiologically or psychologically distort their perception and experience of time passage. In terms of how this concept aligns with the theme of “disobedient bodies,” I believe that perhaps the most fearful way in which we experience the body’s disobedience is when our own bodies reject chronological consistency.',
        'The interpretation of this subject that I applied directly to the design of my garment series is that time judgments are inseparable from the sense of self. Each of the three garments represents a key player in this human perception of time: **subjective time**, **physical time**, and **reactive time**. The idea that {{the heart is the timekeeper of the human body|images/body/heart/1.png, images/body/heart/2.png, images/body/heart/3.png, images/body/heart/4.png, images/body/heart/5.png|Subjective time: the heart garment}} is well-accepted, but the heart itself is not a consistent measure of time; our emotions, mental state, and other external factors often lead to varying perceptions of time passage. In contrast, {{physical time|images/body/spine/1.png, images/body/spine/2.png, images/body/spine/3.png, images/body/spine/4.png, images/body/spine/5.png, images/body/spine/6.png|Physical time: the spine garment}} signifies the temporality of the physical body and its inevitable decay, where everything has a predetermined end. Finally, {{reactive time|images/body/f1.png, images/body/f2.png|Reactive time}} is embodied through the idea of bodily reactions that transcend conscious thought: the body’s immediate reaction to distorted temporality when perception and physiology collide. Things such as instinct and reflex are all reminders of how our bodies act outside of our deliberate control, referencing how these “natural” elements have “never been a guide when it comes to ideal bodies,” as discussed by Lars Svendsen.',
        'Describing more of the technical and stylistic elements, I would like to mention the works of Lucy McRae, who describes herself as a “body architect” and reflects this in their works. I approached my garments with a similar mindset, treating the human body simply as a means for sculptural expression. The process involved the curation of different geometric fabric pieces, experimenting with different textures and forms. I found myself leaning more towards a “feminine” silhouette for the garments, utilizing bunched-up fabric to “pad” different sections, paying tribute to how the article Experimental Fashion Performance discusses how the designer Kawakubo’s use of padding gives a vulnerable and softened aspect to the female body.',
        'Together, these three garments form a chronology of disobedience. By situating these elements within the framework of temporality, the series highlights how the human body rejects the notion of time as a fixed, linear, and “obedient” construct.'
      ] },
    // the magazine: a link to the PDF. Put the file at images/body/magazine.pdf (or change the path here).
    { h: 'The Magazine', embed: 'images/body/magazine.pdf', embedLabel: 'Read the magazine (PDF)' },
    ...BODY_GROUPS.flatMap(({ h, note, folder, files }) => [
      { h, p: [note] },
      { grid: 'whole', figs: files.map((file, i) => ({
          fig: `${h} — ${i + 1}`, cap: '',
          src: `images/body/${folder ? folder + '/' : ''}${file}`,
          alt: `Digital Fashion and the Body: ${h.toLowerCase()}, photo ${i + 1}`
        })) }
    ])
  ]
};

// ---- work-6: Data Visualization ----
// The visualization projects, each a dropdown with a line of the music above it. Inside each: the write-up,
// a link to the live visualization (embed: hover to preview, click to open), and pictures ({ fig } or { figs }).
const VIZ_PLACEHOLDER = n => ({ h: `[Visualization project ${n}]`, fold: true, open: false, bar: n - 1,
  p: ['[One line on what this visualization shows.]'],
  panels: [{ p: ['[Add the write-up here. For a live visualization, add embed: \'https://…\' to this section; for pictures, add a { fig } or { figs } line.]'] }] });
DETAILS['work-6'] = {
  panels: [
    { h: 'Animal Crossing: New Horizons Data Dashboard', fold: true, open: false, bar: 0,
      p: ['An interactive data visualization dashboard transforming gameplay data into meaningful insights using R coding, HTML, and CSS.'],
      panels: [
        { h: 'Interactive Dashboard', p: ['Explore Animal Crossing: New Horizons gameplay data.'],
          embed: 'https://hyouji-joo.shinyapps.io/ac-app/', embedLabel: 'Open the interactive dashboard' },
        { h: 'Project Overview', p: [
            'This project aimed to transform a large dataset of Animal Crossing: New Horizons villagers into an interactive dashboard that supports player exploration. Instead of creating a static set of charts, I approached the work as a UX challenge: designing a tool that helps users discover, compare, and understand villagers in a way that feels intuitive and aligned with the game’s playful aesthetic.'
          ] },
        { h: 'Problem Framing', p: [
            'Early in the project, I identified a gap between what traditional dashboards offer and what users actually need. While the dataset included demographic and personality information, simply visualizing proportions (e.g., gender distribution, personality types) didn’t meaningfully support user goals.'
          ], list: [
            { t: 'Core UX problem', items: ['Players want to explore villagers, not just view statistics. The dashboard needed to function as a discovery tool rather than a data report.'] }
          ] },
        { h: 'Research and Insight Gathering', p: ['To understand user expectations, I analyzed:'], list: [
            'Common player behaviors (e.g., searching for villagers with specific traits)',
            'How fans typically compare villagers (species, personality, aesthetics)',
            'The visual language of Animal Crossing (soft colors, rounded shapes, approachable UI)'
          ] },
        { p: ['These insights guided the dashboard’s interaction model and aesthetic direction.'] },
        { h: 'UX Goals', p: ['From the research, I defined three key experience goals:'], list: [
            { t: 'Support exploration', items: ['Users should be able to browse villagers fluidly and uncover insights through interaction.'] },
            { t: 'Enable personalization', items: ['Filters and controls should allow users to tailor the dashboard to their interests.'] },
            { t: 'Reflect the game’s charm', items: ['The interface should feel friendly, approachable, and consistent with the Animal Crossing world.'] }
          ] },
        { h: 'Design Process' },
        { h: 'Information Architecture', sub: true, p: ['I reorganized the dataset around user-centric categories:'], list: [
            'Personality traits', 'Species', 'Gender', 'Unique characteristics'
          ] },
        { p: ['This structure ensured that each widget surfaced meaningful insights rather than isolated statistics.'] },
        { h: 'Interaction Design', sub: true, p: [
            'I designed a set of widgets that highlight key aspects of each villager. Instead of static charts, each component is interactable, encouraging users to click, filter, and compare.',
            'A sidebar became the personalization hub:'
          ], list: ['Adjustable filters', 'Trait-based sorting', 'View customization'] },
        { p: ['This allowed users to shape their own experience and reduced cognitive load by keeping controls visually grouped.'] },
        { h: 'Visual Design', sub: true, p: ['The dashboard’s aesthetic draws from Animal Crossing’s visual identity:'], list: [
            'Soft color palette', 'Rounded shapes', 'Playful iconography'
          ] },
        { p: ['These choices help the dashboard feel familiar and inviting, reinforcing the exploratory nature of the tool.'] },
        { h: 'Outcome', p: ['The final dashboard goes beyond data visualization. It functions as an interactive exploration tool that:'], list: [
            'Aligns with user intent', 'Encourages curiosity', 'Presents complex data in a friendly, game-aligned format'
          ] },
        { p: ['By grounding each design decision in user needs, the dashboard transforms raw data into a meaningful, intuitive experience.'] }
      ] },
    { h: 'Social Network Analysis: Credit Networks in the Billboard Hot 100', fold: true, open: false, bar: 1,
      p: ['A project based on professional interest: mapping how producers and songwriters connect through the credits they share on Billboard Hot 100 songs, from 2010 to the present.'],
      link: { href: 'https://github.com/hyoujisally/Music-Credit-Share-Network-Analysis-.git', label: 'View the code on GitHub' },
      panels: [
        { h: 'Background: A Project Based on Professional Interest', p: [
            'Building on my experience working at Warner Music Group, I decided to base my social network analysis final project on the music industry, specifically the pool of producers and songwriters who consistently rank in the Billboard Hot 100. Which nodes are connected through the credit they share for a song?'
          ], list: [
            'Which producers, writers, and artists are connected to whom?',
            'Who has access to certain connections, and therefore to certain information?'
          ] },
        { h: 'Why Song Credits Matter', p: [
            'Song credits determine who earns royalties from streaming, sync, copyright, and more, and as the pool of credited individuals grows, so does the distribution of shares. A more selective, tighter pool of producers would indicate that revenue is held by a select group of individuals.',
            'The product of the music industry is music, so it’s important to understand the nature of its production.'
          ] },
        { h: 'Research Questions', list: [
            'How has the concentration of producers and writers in the Billboard Hot 100 changed within the music industry’s social network from 2010 to the present day?',
            'Has the role of the “producer” changed because of performers who also compose their own music?',
            'Has the pool of producers grown more exclusive over time, with very few individuals at the “center” of the social network?'
          ] },
        { h: 'Data Collection', list: [
            { t: 'Billboard Hot 100 charts', items: [
                'The chart data came from a well-known public GitHub repository containing JSON files for every Billboard Hot 100 chart in history, starting from 1958 and updated daily.'
              ] },
            { t: 'Song credits', items: [
                'Producer and songwriter credits came from the Genius API, using lyricsgenius, a Python package that accesses song titles, artists, and lyrics directly from Genius.com.'
              ] },
            { t: 'Datasets', items: [
                'I generated two CSV datasets: a comprehensive list of all charts, and a list that excludes repeats of a song (unique songs).'
              ] }
          ],
          link: { href: 'https://github.com/mhollingshead/billboard-hot-100', label: 'The Billboard Hot 100 data on GitHub' } },
        { h: 'Data Analysis Process', p: [
            'From the master dataset, I generated a network for each year from 2010 to 2026 in Python using NetworkX: every credited individual is a node, and individuals who share a credit are connected by a weighted edge.',
            'This is also where I made the classification variables for the different types of producer roles:'
          ], list: [
            { t: 'Performer-creators', items: ['Individuals who perform and also wrote or produced.'] },
            { t: 'Producer-writers', items: ['Individuals who produced and wrote without performing.'] },
            { t: 'Single-role specialists', items: ['Individuals with a single role: just creator, just writer, or just producer.'] }
          ] },
        { p: ['For each year, I calculated a betweenness centrality score for the entire network (one network per year) to measure the bridging “intensity” within the pool of creatives in the music industry.'] }
      ] },
    { h: 'Sociology of Online News: Coverage of the 2026 Midterm Elections', fold: true, open: false, bar: 2,
      p: ['A study of how 18 news outlets, grouped by the political makeup of their audiences, headlined the 2026 midterm elections from October 1 to November 3, 2026.'],
      link: { href: 'https://github.com/hyoujisally/sociology-of-online-news.git', label: 'View the code on GitHub' },
      panels: [
        { h: 'Overview', p: [
            'This project collected midterm election headlines from 18 outlets and compared three things across the political spectrum: how much each group of outlets covered the midterms, how their headlines were worded, and which candidate they named in the Texas Senate race between James Talarico and Paxton.',
            'Outlets were grouped into five tiers (Far Left, Left-leaning, Center, Right-leaning, and Far Right) using Pew Research Center’s 2025 news media tracker, which groups outlets by who reads them, not by what they say.'
          ] },
        { h: 'Data Collection and Coding', list: [
            { t: 'Source', items: [
                'Headlines came from Google News search feeds, queried for each outlet in 4-day windows with two search strings: general midterm terms, and Paxton, Talarico, and the Texas Senate.'
              ] },
            { t: 'Cleaning', items: [
                'Of 12,326 harvested headlines, those inside the October 1 to November 3 window, in English, and not duplicated within an outlet were kept.',
                'The cleaned dataset holds 3,921 midterm headlines, 411 of them about the Texas Senate race.'
              ] },
            { t: 'Coding', items: [
                'Each headline was coded as midterm coverage (or not) by keyword rules applied in a fixed order, from election-only terms like “battleground” and “early voting” to exclusions for foreign, sports, and local elections.',
                'Wording measures use only written headlines (articles, opinion, video, and roundups): 3,795 in all.'
              ] }
          ] },
        { h: 'Findings', list: [
            { t: 'Volume', items: [
                'Midterm headlines per day rose in every tier, with the steepest climb in the final week. Between October 1–7 and October 28–November 3, Left-leaning outlets ran 3.22 times as many, Center 3.08, Right-leaning 3.40, and Far Right 2.69.'
              ] },
            { t: 'Wording', items: [
                'Horse-race words (polls, leads, toss-ups) appeared in 22.1% of Left-leaning written headlines, compared with 8.0% of Right-leaning ones.',
                'The Far Right stood out on alarm words (11.9%, compared with 5.8% for Left-leaning outlets) and rarely asked a question (2.6%).'
              ] },
            { t: 'The Texas Senate race', items: [
                'Most outlets named Talarico more often than Paxton, and the share rose toward the right: Talarico appeared in 55% of Left-leaning, 56% of Center, 72% of Right-leaning, and 76% of Far Right Texas Senate headlines.',
                'Texas Senate coverage held flat at roughly 10 to 15 headlines a day and did not surge before Election Day.'
              ] }
          ] },
        { figs: [
            { fig: 'Volume over time', cap: 'Midterm headlines per day rose in every tier, with the steepest climb in the final week.', src: 'images/news/1_volume_over_time.png', alt: 'Line chart of midterm headlines per day by tier, October 1 to November 3, 2026' },
            { fig: 'Wording by tier', cap: 'Competition words lead in every tier. The Far Right stands out on alarm words and rarely asks a question.', src: 'images/news/2_wording_by_tier.png', alt: 'Bar chart of headline wording measures by tier' }
          ] },
        { figs: [
            { fig: 'Texas Senate naming', cap: 'Texas Senate: most outlets name Talarico more than Paxton.', src: 'images/news/3_texas_naming_by_outlet.png', alt: 'Bar chart of Texas Senate headlines naming each candidate, by outlet' },
            { fig: 'Texas Senate per day', cap: 'Texas Senate coverage held flat at roughly 10 to 15 headlines a day.', src: 'images/news/4_texas_per_day.png', alt: 'Bar chart of Texas Senate headlines per day with a 7-day average' }
          ] },
        { h: 'Known Limits', list: [
            'The headlines are a retrieved sample from Google News search feeds, not each outlet’s full output, so results are counts and shares within the sample.',
            'The tiers describe each outlet’s audience, not its content.',
            'The Far Left tier has very few midterm headlines, so it isn’t used for tier-level comparisons.',
            'The keyword rules were tuned by reading samples of included and excluded headlines; they are not a substitute for human coding.'
          ] }
      ] }
  ]
};

// ---- work-1: Warner Music Group ----
// The two systems are folds: { fold: true, p: [summary that always shows], open: false, panels: [sections inside] }.
// Click a heading to open or close its sections. Set open: true to start one open.
DETAILS['work-1'] = {
  lede: 'Warner Music Group: Automating Operations for Digital Specialty Products',
  panels: [
    { h: 'Project overview', facts: [
        ['Role', 'Digital Operations Intern, Emerging Talent Associate'],
        ['Location', 'Los Angeles'],
        ['Timing', 'Summer 2026'],
        ['Team', 'Digital Specialty Products'],
        ['Tools', 'Snowflake SQL, Python, R (tidymodels), Google Apps Script, Google Cloud (Workflows, Cloud Functions, Vertex AI), Gmail and Chat APIs']
      ],
      p: [
        'At Warner Music Group, I spent most of my internship building automation for the Digital Specialty Products team, whose YouTube claiming work relied on manual sheet-checking and chasing missing information. I designed and prototyped two systems to move that work into the background, and tested both end to end with sample data. Alongside them, I queried and joined digital asset datasets with 1M+ rows in Snowflake to build custom reports for label requests, and automated recurring metadata reports with Python.'
      ] },

    { h: 'Atlantic Unclaimed Video Autoalert System', fold: true, open: false,
      p: ['A Google Apps Script system that monitors a claiming sheet and reminds the right person to act, based on claim type and time elapsed.'],
      panels: [
        { h: 'Alerts: Notifying the Right Person', list: [
            { t: 'Status emails', items: [
                'When asset codes are created, the team is notified that the video is ready to submit to YouTube.',
                'When a claim is marked submitted, a confirmation email goes out with the track details, who submitted it, and whether the track is chart eligible.'
              ] },
            { t: 'Alert format', items: [
                'Alerts go out as styled emails and Google Chat messages with track metadata, time overdue, the responsible person, and a link to the exact row.',
                'I capped alerts at one per issue per 24 hours to prevent alert fatigue.'
              ] }
          ] },
        { h: 'Data Cleaning and Formatting: Routing Each Request', list: [
            { t: 'Intake', items: [
                'New requests are timestamped automatically.',
                'A custom lookup function assigns each request to a content manager by matching the artist against a roster tab.'
              ] },
            { t: 'Unassigned claims', items: [
                'Requests with no content manager are sent to Team Claim in one bundled report.'
              ] },
            { t: 'Duplicate and Not Atlantic requests', items: [
                'These requests move to their own tabs and leave the alert flow.',
                'Not Atlantic requests are emailed to the matching team.'
              ] }
          ] },
        { h: 'Timers: Enforcing Response Times', list: [
            { t: 'Urgent claims', items: [
                'A 4-hour SLA, then repeat alerts every 24 hours.',
                'Bulk submissions are grouped into one alert per submission.'
              ] },
            { t: 'Non-urgent claims', items: [
                'A 72-hour SLA, with delayed tracks bundled into one summary email per submitter.'
              ] }
          ] }
      ] },

    { h: 'Parasitic Fingerprint Detection System', fold: true, open: false,
      p: ['A claim tracking workflow and prediction model for catching parasitic (fraudulent) fingerprints on YouTube.'],
      panels: [
        { h: 'Overview: What Parasitic Fingerprinting Is', p: [
            'In the music industry, a claim is a demand for ownership credit and revenue from an asset, such as a sound recording. On YouTube, claims are driven by audio fingerprinting: Labels submit fingerprints of their recordings, and matching uploads are claimed automatically.',
            'Parasitic (fraudulent) fingerprinting happens when a fingerprint is submitted for audio content the label doesn’t exclusively own, such as ambient noise, nature sounds, royalty-free loops, or AI-generated tracks. Because uncaught parasitic fingerprints lead to illegitimate claims and financial loss, catching them was a core priority for the Digital Specialty Products team.'
          ] },
        { h: 'Part 1: System Wireframe', p: [
            'My manager ran a weekly risk scan on claiming information, using a filter with traits and characteristics of parasitic claims, and wanted to automate the process. Together, we designed an end-to-end architecture that connected Snowflake, Google Cloud, and Google Workspace so that flagged fingerprints could move through detection, review, and archive with little to no manual action.'
          ],
          list: [
            { t: 'Automated reports', items: [
                'Each week, a Google Cloud Python function runs the risk scan query in Snowflake.',
                'The report is saved in the designated Google Drive folder.'
              ] },
            { t: 'Google Sheet review tracker', items: [
                'The risk report is loaded into a Google Sheet, where reviewers mark each claim request as parasitic or legitimate.',
                'When a status is assigned, Apps Script functions sort the row into its designated tab (parasitic or cleared) and log the reviewer’s name.',
                'Additional tabs summarize the flags by type of parasitic claim and by individual.'
              ] },
            { t: 'Self-cleaning and archiving', items: [
                'Work in progress stays in the Google Sheet.',
                'Once its status is confirmed, it moves into an external archive sheet.'
              ] },
            { t: 'Alerts and reporting', items: [
                'Apps Script functions email the team when a rep owner reaches 10+ flagged assets.',
                'Weekly summary emails go out to the team.'
              ] },
            { t: 'Feedback loop', items: [
                'The product identification codes of cleared assets are sent back to the risk scan filter in Snowflake, so cleared assets don’t reappear in future scans.'
              ] }
          ] },
        { fig: 'System wireframe', cap: 'Designed architecture connecting Snowflake, Google Cloud, and Google Workspace.', src: 'images/wmg/wireframe.png', alt: 'Diagram of the parasitic claim workflow from the Snowflake risk scan to the Google Sheets tracker, alerts, archive, and model loop' },
        { h: 'Part 2: Prediction Models', p: [
            'An important feature of the above wireframe is the machine learning loop that would continuously expand upon the filter for parasitic traits based on confirmed parasitic claims. While the actual classification models will be in Python to utilize Vertex AI Training in Google Cloud, I approached the project through R in order to quickly prototype and compare several model types on the data before actually committing to any design decision. I also wanted to test the usability of the claim data itself because there were no official datasets provided by WMG for confirmed parasitic claims.'
          ],
          list: [
            { t: 'Data and setup', items: [
                'I split the set of 228 reviewed claims into 182 training and 46 test claims.',
                'Both splits keep the same parasitic-to-legitimate ratio (about 43:57).'
              ] },
            { t: 'Feature engineering', items: [
                'Beyond the basic claim details, I extracted features from the track titles (common word fragments and text patterns).',
                'I encoded high-cardinality fields like rep owner and artist, so the model could pick up on naming patterns typical of parasitic content.'
              ] },
            { t: 'Model comparison', items: [
                'I tuned and compared three statistical models using repeated 10-fold cross-validation.',
                'Because missing a fraudulent claim costs far more than an extra manual review, I prioritized catching parasitic claims over avoiding false positives.'
              ] },
            { t: 'Final results', items: [
                'On the 46 held-out claims, the Random Forest model reached 97.8% accuracy and 100% recall, catching all 20 parasitic claims, with one false positive among 26 legitimate claims.',
                'I chose Random Forest because it performed best in cross-validation (ROC-AUC of 0.995) and trained about twice as fast as XGBoost.'
              ] }
          ],
          embed: 'images/wmg/results.html', embedLabel: 'Open the full model report',
          link: { href: 'https://github.com/hyoujisally/parasitic-claiming-.git', label: 'View the code on GitHub' } }
      ] },

    { h: 'Outcome', p: [
        'Both systems were built and tested with sample data. The autoalert system was designed to replace manual checking with automatic SLA enforcement. Also, the parasitic claim tracker and model are a working proof of concept for pre-scoring weekly reports so reviewers can focus on the uncertain cases.'
      ] },

    { h: 'Tools', list: [
        'Snowflake SQL',
        'Python',
        'R (tidymodels)',
        'Google Apps Script',
        'Google Cloud (Workflows, Cloud Functions, Vertex AI)',
        'Gmail and Chat APIs'
      ] }
  ]
};



// ---- work-2: Credit Karma client project (in progress) ----
DETAILS['work-2'] = {
  lede: 'Making Credit Karma the weekly money habit for Gen Z.',
  panels: [
    { h: 'Project Overview', p: [
        'Intuit asked our team how Credit Karma could become an everyday money habit for Gen Z. We researched how students manage money, found what was keeping them away, and designed and tested a new first experience built around what they already care about: their spending.'
      ] },
    { h: 'Research: How Gen Z Manages Money', p: ['We surveyed 44+ students and gathered prototype feedback from 25. Three insights shaped the work:'], list: [
        { t: 'Credit isn’t on their radar yet', items: ['70% rate their credit knowledge 3/5 or lower, and most still depend on their parents.'] },
        { t: 'Spending is', items: ['80% spend $250+ a month on discretionary items, often across multiple cards.'] },
        { t: 'They want check-ins, not budgets', items: ['82% track nothing, but 82% want a Sunday summary or a post-purchase nudge: quick and regular, with no extra work.'] }
      ] },
    { h: 'The Problem: A Wall Before the Value', p: [
        'Credit Karma’s best features sit behind a wall of personal information. New users are asked for their data before they see anything, and app reviews show trust is already low.'
      ] },
    { h: 'Our Recommendation: Lead with Spending', p: [
        'Show the value first and ask for information later. Spending is what Gen Z already watches, so it comes first; credit features follow once users are engaged and ready.'
      ] },
    { figs: [
        { fig: 'The wall', cap: 'Great features sit behind a wall of personal information.', src: 'images/ck/wall.jpg', alt: 'Diagram: Download, then the wall of personal information, then the features users never reach' },
        { fig: 'Who we designed for', cap: 'Four personas, from the multi-card beginner to the anxious avoider.', src: 'images/ck/personas.jpg', alt: 'Four personas: The Multi Card Beginner, The Debit Only Skeptic, The Spreadsheet Senior, The Anxious Avoider' }
      ] },
    { h: 'The Prototype: A Weekly Recap', p: [
        'We designed for four personas, led by Maya, a student with two credit cards who never tracks her spending. Her journey:'
      ], list: [
        { t: 'Trust first', items: ['Sign-up asks only for a name and email and says plainly that her data is never sold; her credit isn’t checked.'] },
        { t: 'Value right away', items: ['Money Rings, like fitness rings, and a sample recap show all her spending in one place before she links anything.'] },
        { t: 'A habit, on her terms', items: ['She picks what to see, keeps her numbers private, and gets a one-minute recap every Sunday.'] }
      ] },
    { figs: [
        { fig: 'Onboarding', cap: 'Only a name and email, and a clear promise about her data.', src: 'images/ck/onboarding.jpg', alt: 'Create-account and start-with-the-basics screens' },
        { fig: 'Money Rings', cap: 'Rings like the fitness rings she already closes.', src: 'images/ck/money-rings.jpg', alt: 'Money Rings screens with a keep-it-simple recap option' },
        { fig: 'A sample recap', cap: 'All her spending in one place, for the first time.', src: 'images/ck/recap.jpg', alt: 'Your week, by the numbers: a sample spending recap' }
      ] },
    { figs: [
        { fig: 'Home-screen widget', cap: 'A widget beside her other habit loops, with her numbers kept private.', src: 'images/ck/widget.jpg', alt: 'Home-screen widget setup with a Keep my numbers private toggle' },
        { fig: 'Sunday recap', cap: 'A one-minute check-in every Sunday.', src: 'images/ck/sunday-recap.jpg', alt: 'Lock screen with the Sunday recap notification' }
      ] },
    { h: 'Key Takeaways', list: [
        { t: 'Make transparency visible', items: ['Explain why each piece of information is needed, and give users controls like “Keep my numbers private.”'] },
        { t: 'Let users customize', items: ['Gen Z trusts its own judgment over a company’s, so control is how Credit Karma earns trust.'] },
        { t: 'Lead with spending, not credit', items: ['Spending builds the trust and the habit; credit comes in naturally once users are engaged.'] }
      ] },
    { h: 'Next Steps', p: [
        'Define the minimum data Credit Karma needs, design an entry point into learning about credit, and build an interactive credit-building journey.'
      ] }
  ]
};

// ---- work-3: Polaris, FigBuild 2026 ----
DETAILS['work-3'] = {
  lede: 'Your memories aren’t a timeline. They’re a constellation. Polaris maps memories by how they felt, not when they happened.',
  cover: 'images/polaris/cover.webp',
  embed: 'https://zone-droop-75286977.figma.site/',
  panels: [
    { h: 'The Problem: Memories Are Felt, Not Recorded', p: [
        'When thinking back to the time on the playground as a child, do you remember the exact steps of what you did there? You might not, because memories are rarely recalled through sequential logic.',
        'People remember moments through sensory cues and emotions, but the digital and physical tools we have only record the objective details of a moment, making it hard to recognize patterns in the moments that bring comfort, joy, or connection. Another barrier is that emotions such as nostalgia are abstract and difficult to quantify, so they are often undertracked and underrepresented in existing tools.',
        'With the theme of sensory experiences, we decided to explore how to qualitatively measure or track memories. The focus of our product was not to act as an interpreter between complex and abstract feelings, but to give users autonomy in defining their own experiences, so they can understand their own emotional patterns and the sensory cues that trigger nostalgia.',
        'We wanted to help users recognize the patterns behind both positive and negative experiences without necessarily having to “re-experience” them.',
        'With three days to build, we could not run user research, but design choices were made with scientific evidence, particularly with the color selections.'
      ] },
    { h: 'Project Overview: Tracking Nostalgic Resonance', facts: [
        ['Team', 'Rosie Nguyen, Hyouji Joo, Cheryl Nguyen, Reese Odvina'],
        ['Role', 'Concept Lead · UX/UI Designer'],
        ['Context', 'FigBuild 2026 · 3-day hackathon'],
        ['Prompt', 'Identify something intangible, invisible, or previously unmeasurable about the human sensory experience and design a speculative tool to track and influence it. This tool should be designed to support a wellness goal or behavioral change for an individual or a group.'],
        ['Built with', 'Figma, Figma Make, Claude, React, JavaScript, HTML, CSS'],
        ['Target users', 'Any users navigating stress, transition, and identity, particularly those often reflecting on the past to experience certain emotions again']
      ],
      p: ['Polaris is a memory visualization tool that turns personal experiences into a constellation of emotional and sensory signals. The “new” sense we chose to track is nostalgic resonance: the emotional signal created when memories share similar sensory environments and feelings.'
      ]
    },

    { h: 'My Contributions as Concept Lead and UX/UI Designer', list: [
        { t: 'Concept', items: [
            'Originated the concept of organizing memories like a constellation system.',
            'Clusters and connections form based on the emotions attached to each memory.'
          ] },
        { t: 'Visual system', items: [
            'Designed the emotion-color system, icons, and memory orbs.',
            'Specified an orb PNG generator (built with AI assistance) that outputs all 41 emotion combinations.'
          ] },
        { t: 'Wireframing and layout', items: [
            'Led wireframing and page layout.',
            'Tested and implemented the user flow in the page structure.'
          ] },
        { t: 'UI components', items: [
            'Defined the input form, tags, hover and click states, zoom controls, and the Resonance Insight panel.'
          ] },
        { t: 'Prototype', items: [
            'Co-built the Figma Make prototype with teammates.',
            'Split work fluidly under a 3-day timeline and a limited credit budget.'
          ] }
      ] },
    { fig: 'A personal sky', cap: 'A personal sky where stars cluster by feeling.', src: 'images/polaris/full_view.png', alt: 'Personal constellation with colored memory stars connected by feeling, a hovered star reading “A long phone call”' },
    { h: 'Why Constellations: Memories Connect Over Time', p: [
        'I championed constellations because connectivity felt like the right metaphor for sensory experiences and gave us a wide range of design opportunities.',
        'Memories and the emotions attached to them link over time, mentally forming a “constellation” that influences behavior.'
      ] },
    { figs: [
        { fig: 'The landing page', cap: 'The landing page: “Your memories aren’t a timeline. They’re a constellation.”', src: 'images/polaris/main_page.png', alt: 'Polaris landing page with the headline and a Start Your Constellation button' },
        { fig: 'Every memory, a star', cap: 'Every memory, a star: Rest your gaze on any star, and let it whisper back the feeling.', src: 'images/polaris/landing.png', alt: 'Landing page section showing a sample constellation of colored stars' }
      ] },
    { h: 'The Main Experience: Every Memory Becomes a Star', p: [
        'Users capture a memory by reflecting on what they sense, then tagging its cues, such as sound, place, and emotion. Each memory becomes a star in a personal galaxy. Each star encodes a memory: color for emotion, and brightness for intensity.'
      ] },
    { fig: 'Capturing a memory', cap: 'Tag a memory’s sensory cues and emotions.', src: 'images/polaris/sensory.png', alt: 'Memory analysis screen: “We detected a signal”, category Sound, “crackling fireplace”, with Confirm, Shuffle and Edit' },
    { h: 'How the Constellation Grows: Three Patterns Emerge', p: ['As more memories are added, Polaris surfaces three patterns:'], list: [
        { t: 'Clusters', items: ['Emotionally connected memories.'] },
        { t: 'Bridges', items: ['The lines connecting distant life moments.'] },
        { t: 'Recurring signals', items: ['Sensory cues that repeat across memories.'] }
      ] },
    { h: 'Emotion and Color System: Designing with Color Psychology', p: [
        'Our team based our design on color psychology, which explains our tendency to associate certain colors with specific emotions.',
        'Pixar’s Inside Out is a primary example of how effective color theory is in visual understanding.',
        'Using colors we culturally associate with certain emotions (e.g., blue as sadness) proves to be effective in communicating abstract feelings to a wide audience.',
        'This influenced our approach of mapping emotions to multi-colored constellations.',
        'There are six base emotions: joyful, peaceful, nostalgic, melancholy, anxious, and bitter.',
        'Up to three can blend into a single orb, giving 41 combinations: 6 singles, 15 pairs, and 20 triplets.',
        'You can also add your own color. The mood interpreter assigns it a name and a description based on color psychology, and you can regenerate the description for a different take.'
      ] },
    { figs: [
        { fig: 'The six emotion orbs', cap: 'The six base emotions, each with its own color and icon.', src: 'images/polaris/emotion-orbs.png', alt: 'Six emotion orbs with their corresponding colors and icons' },
        { fig: 'Your own emotional color', cap: 'Pick any color, and the mood interpreter describes it using color psychology.', src: 'images/polaris/make_color.png', alt: 'Custom color picker with a lavender circle and a mood interpretation reading “Calm & Reflective”, with a Regenerate button' }
      ] },
    { embed: 'images/polaris/nostalgia-color-combinations.html', embedLabel: 'Open the orb color combinations' },


    { h: 'User Experience Flow: From Memory to Constellation' },
    { h: 'Capturing Sensory Experiences', sub: true, p: [
        'A guided prompt (“What’s the strongest thing you’re sensing right now?”) leads to details, sensory tags, and an emotion check: “How does recalling this memory feel right now?” Users pick up to three emotions or choose their own color. On save, the memory becomes a star.'
      ] },
    { figs: [
        { fig: 'Choosing emotions', cap: 'Choose up to three emotions, or pick your own color.', src: 'images/polaris/choose_color.png', alt: 'Emotion selection screen: joyful, nostalgic, peaceful, bitter, anxious, melancholy' },
        { fig: 'Setting intensity', cap: 'How intensely do you feel this memory? Intensity sets the star’s brightness.', src: 'images/polaris/intensity.png', alt: 'Intensity dial at 26% with a slider and an Add to Your Constellation button' },
        { fig: 'A new star', cap: 'Your memory has become a star.', src: 'images/polaris/new_star.png', alt: 'Confirmation screen showing a new teal memory star' }
      ] },
    { h: 'Tracking Sensory Experiences', sub: true, p: [
        'Using the sensory information from the main sequence, Polaris updates the memories for Insights and Library.'
      ] },
    { figs: [
        { fig: 'Insights', cap: 'Making sense of your feelings: The Resonance Insight panel shows patterns in the constellation (sample data used for mockup).', src: 'images/polaris/insights.png', alt: 'The Insights page: “Memories that found each other”, pairs of memories linked by shared feeling' },
        { fig: 'Library', cap: 'A “Constellation Archive” for searching and filtering memories by sensory tag.', src: 'images/polaris/archive.png', alt: 'Constellation Archive with a memory timeline, search, filters, and memory cards' }
      ] },
    { h: 'Manipulating Sensory Experiences', sub: true, p: [
        'Hovering a star shows only its sensory summary (for example, “warm · crowded · energetic”). Clicking opens the full memory. Zooming out reveals clusters and bridges. A Resonance Insight panel surfaces patterns in plain language, and progressive disclosure keeps it from overwhelming users.'
      ] },
    { figs: [
        { fig: 'Hover', cap: 'Hover for sensation.', src: 'images/polaris/example.png', alt: 'Constellation view with a hovered star, “Summer festival with friends: warm · crowded · energetic”, and the Resonance Insight panel' },
        { fig: 'Click', cap: 'Click for the story.', src: 'images/polaris/hover-click2.png', alt: 'Memory panel for “adopting my cats” showing its emotion, date, sensory tags, and orb' }
      ] },


    { h: 'Prototyping in Figma Make: Building Within Constraints', p: [
        'Because the hackathon required us to use Figma Make, we had to figure out ways to work within its limitations.'
      ], list: [
        { t: 'Specs', items: [
            'I prioritized specific prompts when using Figma Make.',
            'I focused first on the overall architecture of layers and components, then on UI components such as color, transitions, timing, and hover behavior.',
            'I corrected issues in wireframing and flow (e.g., a star must appear only after a memory is added).'
          ] },
        { t: 'Scoping', items: [
            'We built the new star animation as an isolated component so that multiple people could work simultaneously.',
            'It was later connected to the main page.'
          ] },
        { t: 'Work division', items: [
            'We split visual UI, assets, motion, and interactions fluidly rather than by fixed roles.',
            'Roles shifted based on the number of credits each member had.'
          ] }
      ] },

    { h: 'Challenges: Aligning the Story and the Interface', p: [
        'We worked cross-functionally within the same Figma Make environment while designing both the narrative flow/presentation and the interface logic. Because the project combined storytelling, UX design, and speculative interaction, we made sure to align the visual design, user flows, and conceptual explanation. We also spent time debugging interactions and animations so that the constellation concept was emphasized and the user experience was seamless.'
      ] },

    { h: 'What We Learned: UX Flows and AI-Assisted Prototyping', p: [
        'We learned more about designing effective UX flows and structuring interfaces that make complex ideas intuitive, including practical wireframing, information architecture, and the importance of narrative in digital product design. We also gained experience with more advanced Figma tools, such as Figma Make, AI prompting, and prototyping features, for future building purposes.'
      ] },

    { h: 'Reflection: Collaborating Across Distance', p: [
        'This project gave me first-hand experience in why teamwork and collaboration are emphasized. Several factors created challenges for our team: All communication had to be digital because we were in different states, and we had to match four daily schedules to find meeting times. We also had to be strategic about how Figma Make credits were distributed and who on the team would primarily use them.'
      ] },
    { h: 'Presentation: The Full Concept Walkthrough', p: ['The Figma presentation covers the full narrative, concept, and prototype walkthrough.'],
      embed: 'https://www.figma.com/deck/iXqua9IgbGv5ajlHcvBmdV/Presentation--Copy-?node-id=1-130&t=JBRZkOEyt1lsWSBa-1' }
  ]
};

// ---- work-4: CradleWave ----
DETAILS['work-4'] = {
  lede: 'CradleWave is a land-based simulator that lets sailors practice roll tacking, a maneuver that can normally only be practiced on the water. My role was the research behind it: observing the Northwestern Sailing Team’s practice, interviewing its sailors, and testing every prototype stage with them, so each design decision traces back to something users said or did.',
  cover: 'images/cradlewave/final-prototype.webp',
  panels: [
    { h: 'Project overview', facts: [
        ['Team', 'Team of 5'],
        ['Role', 'User research: observations, interviews, synthesis, and prototype user testing'],
        ['Context', 'Human-centered design course'],
        ['Target users', 'Competitive sailors on the Northwestern Sailing Team who need more roll tack repetitions than on-water practice allows'],
        ['Outcome', 'Full-scale prototype built around a real 420 sailboat and delivered to the Northwestern Sailing Center']
      ],
      p: [
        'Roll tacking uses body weight to heel the boat so it turns through the wind faster. Sailors described it as a make-or-break skill in racing, yet there was no effective way to practice it on land. We set out to find out why, and what a simulator would need to do for the skill to transfer to the water.'
      ] },
    { h: 'My contributions', list: [
        'Planned and carried out observations at the sailing center, tracking what takes the most time, where sailors hesitate, and what workarounds they invent during setup, on the water, and at pack-up',
        'Interviewed sailing team members with open, non-leading questions, from newer team members to experienced racers, and documented their answers',
        'Synthesized observations and interviews into the journey map, persona, and the needs behind the specification chart',
        'Translated interview findings into measurable requirements, such as 45° heel on each side and setup time targets',
        'Ran user testing on the scaled mockups and the full-scale prototype, and recorded what worked and what didn’t'
      ] },
    { h: 'How we researched', facts: [
        ['Observation', 'Sailing team practice at the Northwestern Sailing Center, using an AEIOU framework'],
        ['Interviews', 'Four members of the sailing team, from a newer sailor to a six-year veteran'],
        ['Synthesis', 'Journey map, persona, weighted concept matrix, specification chart'],
        ['Testing', 'Scaled mockups, a full-scale fit and safety check, then testing with sailing team members']
      ],
      p: [
        'The interview guide opened with background and general learning questions before reaching roll tacking. That order let sailors describe their own experience first, so our questions didn’t steer them toward the answer we expected. We asked what they improvise, what goes wrong for beginners, and what would have helped them learn faster.',
        'The observation plan split a practice into three stages with different things to watch for. Setup showed what takes the most hands, on the water showed hesitation and communication breakdowns, and pack-up often brought out the most candid comments. We asked questions between maneuvers, never mid-tack.'
      ] },
    { h: 'What we observed', p: [
        'On land, the team practices roll tacking by having two sailors stand on opposite sides of a boat, lift it, and tip it while a third sits inside. Our journey map of this process surfaced three pain points. It takes several people, which rules out solo practice. Lifting the boat is tiring, so practice stops quickly. And it can’t be repeated much in one session.',
        'It also can’t happen at all on rainy or windy days, which came up repeatedly in the observation notes.'
      ] },
    { fig: 'Current practice journey map', cap: 'Journey map of how sailors currently try to practice roll tacking on land, with the pain points marked.', src: 'images/cradlewave/journey-map.webp', alt: 'Journey map of land-based roll tack practice' },
    { h: 'What interviews told us', list: [
        'Roll tacking is “make-or-break” for competitive performance, and one team member said, “You can’t really practice rolltacking on land.”',
        'A newer team member estimated that beginners need around four months to land several roll tacks in a row. Practice outside the water was limited to videos, which don’t rehearse the movement.',
        'An experienced sailor said the hardest part is the resistance when pushing the boat back down to flat.',
        'Sailors named the same needs: a rocking, heeling motion, a tiller, the main and jib lines, and hiking straps for the footwork.',
        'They said the sail, mast, and wind direction don’t matter for practice. One sailor added that resistance depends on wind, centerboard, and boat speed, so it would be hard to match.',
        'Sailors volunteered interest: “We would definitely use something you make.”'
      ] },
    { h: 'From findings to design decisions', facts: [
        ['Real 420 hull', 'Sailors ranked a near-perfect copy of the cockpit highest, with the tiller, lines, and hiking straps in place. So we carry the actual boat instead of building a mock cockpit.'],
        ['45° heel', 'Interviews put the heel range at roughly 40–55°, and a technique article we found supports 45° as the functional target. So the cradle reaches 45° each side.'],
        ['No sail or mast', 'Sailors said sails, masts, and wind direction don’t affect the practice. So we left them out and spent our budget on motion and interior accuracy.'],
        ['No resistance rig', 'Resistance varies with wind, centerboard, and speed, and a magnetic-brake concept scored lowest on feasibility. So we dropped it and told the sailors openly what the simulator wouldn’t feel like.'],
        ['Rocking cradle', 'Our concept matrix weighted rolling motion highest (150%), then accurate interior. The rocking cradle scored 14.3, ahead of the pivot mount (13.9) and the resistance simulator (12.5).']
      ],
      p: [
        'We chose the criteria weights from what sailors told us, then scored each concept individually. The rocking cradle came out on top on all five scorecards.'
      ] },
    { h: 'Testing in stages', p: [
        'We tested early and at small scale, so changes were cheap.'
      ], list: [
        'One-twentieth scale 3D-printed profiles: smooth curves made the move between heeled and flat far too easy, so we switched to flat planes.',
        'One-fifth scale laser-cut model with a single 45° step: sailors found the transition far too abrupt. The final profile has a flat section, a 22.5° step, and a 45° step on each side.',
        'Full-scale fit check: some boat supports didn’t touch the hull, so we added foam and checked fit again.',
        'Safety check before any user got in: we strapped in the empty boat and rocked it to 45° on each side, harder and faster each time, until nothing creaked, shifted, or slipped.'
      ] },
    { fig: 'Mockups that shaped the profile', cap: 'Scaled mockups that tested how the cradle profile controls the heel transition.', src: 'images/cradlewave/mockups.webp', alt: 'Small-scale 3D-printed and laser-cut CradleWave models' },
    { h: 'User testing the full prototype', p: [
        'We tested at the sailing center beach with two sailing team members, walking them through the whole process from setup to takedown.',
        'Setup was the biggest pain point. Lifting the roughly 300 lb boat into the frame took about six people, and it was the most laborious and error-prone step. That echoed what we had seen in observation, where heavy boats already needed several people to move. Once the boat was strapped in, the rest was simple.',
        'For roll tacking, sailors said it would be great for training new sailors and very useful for practicing footwork. They found it hard to reach the full 45° heel and easy to overshoot flat on the way out of the tack. Both can likely be fixed by adding weight to the frame, which the design allows.',
        'Only two sailors tested the full-scale prototype, so we treat these results as directional rather than conclusive.'
      ] },
    { fig: 'Testing with the sailing team', cap: 'Sailing team members testing the CradleWave at the Northwestern Sailing Center.', src: 'images/cradlewave/user-testing.webp', alt: 'Sailors testing the CradleWave with a 420 sailboat on the beach' },
    { h: 'Results against what users needed', facts: [
        ['45° heel', 'Pass. The cradle reaches it, and sailors said the range is right and they wouldn’t go further.'],
        ['Accurate interior', 'Pass. A real, rigged 420 means the interior is exact, and sailors could roll tack with their normal controls.'],
        ['Holds heel', 'Pass. The cradle stays in heel while sailors rest in the heel position.'],
        ['Realistic feel', 'Medium. Sailors liked how hard it is to get into heel but found it too easy to overcorrect on exit, a known limit of a gravity-driven design.'],
        ['Natural hiking', 'Medium. Sailors had to exaggerate their movement to reach full heel.']
      ] },
    { h: 'Next steps', list: [
        'Add weight to the frame (sandbags outside, or water inside the hollow PVC) and retest the 45° effort and the overshoot on exit with sailors',
        'Cut setup from about six people and several minutes to two people in under 30 seconds',
        'Test with beginners to see whether the CradleWave shortens the time it takes to learn a roll tack, against a target of one to two months',
        'Track foam pad wear and frame durability over repeated use'
      ] },
    { h: 'Reflection', p: [
        'The research set the priorities that decided between concepts, and testing at each scale caught problems early, including a profile that was too easy and one that was too abrupt. The biggest finding from testing, how many people it takes to load the boat, had already shown up in the observation notes, which is why I now treat observation as a source of requirements, not just context.'
      ] }
  ]
};

// ---- work-5: Glow&Go ----
DETAILS['work-5'] = {
  panels: [
    { h: 'The Problem: Staying Close Across Time Zones', p: [
        'For students abroad, convenient communication often feels unfulfilling, and long-distance calls across time zones can feel draining. Glow&Go set out to make staying connected feel shared and low-pressure.'
      ] },
    { h: 'Project Overview', p: [
        'Glow&Go pairs an app with a bracelet: users pick three loved ones, and lights on the bracelet show at a glance when each is free to talk, so connecting takes no scheduling and no screen time.'
      ] },
    { fig: 'Final screens', cap: 'The final app: connecting contacts, and the home screen with three lights per contact, only one lit at a time.', src: 'images/glow/final-screens.jpg', alt: 'Final Glow&Go app screens: Connecting Contacts and the home screen with three contacts’ lights' },
    { h: 'Research: Understanding Students Abroad', p: [
        'A PACT analysis and needs-finding showed that students abroad struggle to balance staying connected with living in the present. They wanted shared, multimedia connection without screen-based distractions or the pressure of formal conversations.'
      ] },
    { h: 'Process: From Sketch to Tested Prototype', list: [
        { t: 'Low fidelity', items: ['An app widget and bracelet, each with three lights showing contacts’ availability. Testing found it clean and quick to read, but the colors were ambiguous and the bracelet was only a passive display.'] },
        { t: 'Medium fidelity', items: ['Renamed Glow&Go, the prototype added confirmation pages and clearer steps for selecting and editing contacts.'] },
        { t: 'Usability study', items: ['A moderated study tested whether first-time users could set up the app, choose contacts, and read the bracelet’s lights on their own.'] }
      ] },
    { figs: [
        { fig: 'The first sketch', cap: 'Planning the product.', src: 'images/glow/sketch.jpg', alt: 'Hand-drawn sketches of the app screens and bracelet' },
        { fig: 'Low-fidelity prototype', cap: 'EZ: an app widget and bracelet with three lights.', src: 'images/glow/lofi.jpg', alt: 'Low-fidelity prototype slide showing a three-light widget' },
        { fig: 'Medium-fidelity prototype', cap: 'Design edits for clarity, across the full set of screens.', src: 'images/glow/midfi.jpg', alt: 'Medium-fidelity Glow&Go screens laid out as a flow' }
      ] },
    { h: 'Outcome: What Testing Changed', p: [
        'The study surfaced three problems, and each led to a design change:'
      ], list: [
        { t: 'Contact setup was confusing', items: ['Added a message explaining that each contact receives an invitation.'] },
        { t: 'The stoplight colors were misread', items: ['Reshaped the bracelet as a triangle, gave each contact three lights with only one lit at a time, and confirmed connections with a check or an X.'] },
        { t: 'Users needed more guidance', items: ['Added a Help/FAQ button on the home screen that explains the signals.'] }
      ] },
    { figs: [
        { fig: 'Design edits', cap: 'Confirmation pages and clearer contact selection.', src: 'images/glow/design-edits.jpg', alt: 'Slide showing the bracelet prototype and the added confirmation and contact-editing frames' },
        { fig: 'Final evaluations', cap: 'Three problems from testing, and the solutions for each.', src: 'images/glow/evaluations.jpg', alt: 'Final evaluations slide with solutions for contact addition confusion, stoplight confusion, and lack of user guidance' }
      ] }
  ]
}



// ---------------------------------------------------------------------
// THE FACTS ON EACH PROJECT'S LEFT PAGE
// Every project lists the same facts on its left page, in this order: Role, Timing, Team, Skills, Tools
// (then anything else, like Context or Target users). The facts in a write-up's "Project overview" are used,
// and the lines below add to them or replace them. Anything in [square brackets] is a placeholder to fill in.
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// DEFINED TERMS: in a write-up, the first time each term appears it is underlined, and hovering it shows
// the definition (like a Wikipedia link preview). Plurals and -ing forms match too ("claims", "claiming").
// ---------------------------------------------------------------------
DETAILS['work-6'].terms = {
  'Horse-race': 'Headlines framed around who is winning rather than the issues: polls, leads, trails, toss-ups, battlegrounds, flips, and momentum.',
  'Betweenness centrality': 'How often a node lies on the shortest paths between other nodes in a network. Nodes with high betweenness act as bridges, connecting groups that would otherwise be far apart.'
};
DETAILS['work-1'].terms = {
  Parasitic: 'Fraudulent.',
  Fingerprint: 'An audio fingerprint: a compact digital summary of a recording’s sound. Labels submit fingerprints of their recordings to YouTube, and uploads whose audio matches are identified automatically.',
  Claim: 'A demand for ownership credit and revenue from an asset, such as a sound recording. On YouTube, a claim is placed on an upload whose audio matches a label’s fingerprint.',
  'Statistical models': 'Logistic Regression: estimates the probability that a claim is parasitic from a weighted combination of its features.\n\nRandom Forest: combines many decision trees, each trained on a random sample of the data, and takes their majority vote.\n\nXGBoost: builds decision trees one after another, each correcting the errors of the ones before it.'
};

const INFO = {
  'work-1': [['Skills', 'Workflow automation, SQL reporting, classification modeling, systems design']],
  'work-2': [['Role', '[your role]'], ['Timing', '2026'], ['Team', 'Kaytie Chung, Christine Shin, Jaimie Chun, Sally Joo'], ['Client', 'Intuit, Credit Karma'],
             ['Skills', 'Survey design, statistical analysis, persona development, UX design, prototyping'], ['Tools', 'R, [tools]']],
  'work-3': [['Skills', 'Concept development, UI design, wireframing, prototyping']],
  'work-4': [['Timing', '2026'],
             ['Skills', 'Observation, interviewing, research synthesis, usability testing'],
             ['Tools', '[the tools you used]']],
  'work-5': [['Role', '[your role]'], ['Timing', '2025'], ['Team', 'Sally (Hyouji) Joo, Sharini Rahman, Brady Kamali, Yitian Zhang'], ['Skills', 'Needs-finding, prototyping, usability testing'], ['Tools', '[tools]'], ['Context', 'HCI course, Group #2']],
  'work-6': [['Role', '[your role]'], ['Timing', '[years]'], ['Skills', 'Data visualization, UX design, social network analysis, [skills]'], ['Tools', 'R, Python (NetworkX, lyricsgenius), Genius API, HTML, CSS, [tools]']],
  'creative-1': [['Role', 'Photographer'], ['Timing', '[years]'], ['Skills', 'Live event photography, editing'], ['Tools', '[camera and editing software]']],
  'creative-2': [['Role', 'Designer and art director'], ['Timing', '[year]'], ['Skills', 'Fashion design, art direction, [skills]'], ['Tools', '[tools]']],
  'creative-3': [['Role', 'Designer'], ['Timing', '[year]'], ['Skills', 'Layout, typography, [skills]'], ['Tools', '[tools]']],
  'creative-4': [['Role', '[your role]'], ['Timing', '[year]'], ['Skills', 'Film analysis, visual storytelling'], ['Tools', '[tools]']]
};
Object.keys(INFO).forEach(id => { DETAILS[id] = Object.assign(DETAILS[id] || {}, { info: INFO[id] }); });

// ---------------------------------------------------------------------
// PART 3: fallback panels (shown for projects with no DETAILS entry)
// ---------------------------------------------------------------------
const WORK_PANELS = [
  { h: 'Project overview', p: ['Who the users were, what problem they faced, and the evidence that showed it was worth solving.'] },
  { h: 'Research and observations', p: ['The methods you used (interviews, surveys, usability sessions, analytics) and what you observed. State the sample size and the finding that shaped the direction.'] },
  { fig: 'Research artifact', cap: 'An affinity map, interview synthesis, or data chart that supports the finding above.' },
  { h: 'Design decisions and rationale', p: ['For each major decision: what you chose, the alternatives you considered, and the observation or test result that justified the choice.'] },
  { h: 'Testing and iteration', p: ['How you tested (task, participants, metrics), what failed or confused users, and what you changed in response.'] },
  { h: 'Outcome and reflection', p: ['Measured results (task success, time on task, user feedback) and what you would test next.'] }
];
const CREATIVE_PANELS = [
  { h: 'Project overview', p: ['What you set out to explore, the constraints you worked within, and the references or observations that shaped the brief.'] },
  { fig: 'Process and iterations', cap: 'Sketches, drafts, or versions showing how the work developed.' },
  { h: 'Decisions and feedback', p: ['The choices you made at each stage, the critique or testing that informed them, and what you revised as a result.'] },
  { fig: 'Final piece', cap: 'The finished work, with a note on which decisions are visible in it.' }
];