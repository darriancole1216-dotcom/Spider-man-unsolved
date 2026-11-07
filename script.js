const districts = [
  {
    id: 'midtown',
    name: 'Midtown',
    x: 605,
    y: 110,
    w: 360,
    h: 240,
    fill: '#213e72',
    description:
      'A dense web of towers, rooftops, and high-speed chases. Midtown is where the skyline and security response meet.',
    missions: [
      'Thread the skyscraper rooftops during rush hour.',
      'Intercept a delivery route through Times Square.',
      'Scale a hijacked tower with quick aerial swings.'
    ]
  },
  {
    id: 'downtown',
    name: 'Downtown',
    x: 695,
    y: 360,
    w: 310,
    h: 220,
    fill: '#1d4e60',
    description:
      'Bustling bridges, dark alleys, and financial towers. Best for stealth takedowns and fast rooftop traversal.',
    missions: [
      'Track a criminal signal under the elevated trains.',
      'Stop a chase near the harbor tunnels.',
      'Save civilians during a bridge blackout.'
    ]
  },
  {
    id: 'harlem',
    name: 'Harlem',
    x: 470,
    y: 145,
    w: 120,
    h: 205,
    fill: '#2d5d49',
    description:
      'Neighborhood rooftops, old brick corners, and resilient local streets framed by tall, historic blocks.',
    missions: [
      'Rooftop loop through the apartment crescents.',
      'Protect a neighborhood block from an ambush.',
      'Navigate a skyline route with narrow windows.'
    ]
  },
  {
    id: 'upper-east',
    name: 'Upper East Side',
    x: 330,
    y: 120,
    w: 160,
    h: 180,
    fill: '#4a3d74',
    description:
      'Quiet avenues and elegant facades give way to sharper vantage points whenever the city kicks into overdrive.',
    missions: [
      'Survey the skyline from the private rooftops.',
      'Chase a suspect through luxury courtyards.',
      'Dodge patrol drones near the old estates.'
    ]
  },
  {
    id: 'brooklyn',
    name: 'Brooklyn',
    x: 210,
    y: 350,
    w: 360,
    h: 230,
    fill: '#385f63',
    description:
      'Transit lines, bridges, and scattered industrial blocks. Great for speed runs and dramatic swing arcs.',
    missions: [
      'Leap over the bridge approaches at full speed.',
      'Secure the waterfront warehouse network.',
      'Catch a moving target while crossing the skyline loop.'
    ]
  },
  {
    id: 'queens',
    name: 'Queens',
    x: 70,
    y: 290,
    w: 180,
    h: 250,
    fill: '#4c5043',
    description:
      'Suburban edges, rail lines, and light industrial pockets create ideal cover for stealth and mobility.',
    missions: [
      'Cut across the train yards before alarms trigger.',
      'Protect the neighborhood access roads.',
      'Web a cross-city route between elevated spans.'
    ]
  }
];

const landmarks = [
  { name: 'Empire State', x: 770, y: 180 },
  { name: 'Brooklyn Bridge', x: 420, y: 420 },
  { name: 'Queensboro', x: 280, y: 314 },
  { name: 'Hudson', x: 920, y: 495 }
];

const districtLookup = Object.fromEntries(districts.map((d) => [d.id, d]));

const districtGroup = document.getElementById('districts');
const routesGroup = document.getElementById('routes');
const landmarksGroup = document.getElementById('landmarks');
const districtName = document.getElementById('district-name');
const districtDescription = document.getElementById('district-description');
const missionList = document.getElementById('district-missions');

function buildDistricts() {
  districts.forEach((district, index) => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', district.x);
    rect.setAttribute('y', district.y);
    rect.setAttribute('width', district.w);
    rect.setAttribute('height', district.h);
    rect.setAttribute('rx', 24);
    rect.setAttribute('fill', district.fill);
    rect.setAttribute('opacity', index === 0 ? '0.95' : '0.8');
    rect.setAttribute('class', `district active`);
    rect.setAttribute('data-id', district.id);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', district.x + district.w / 2);
    label.setAttribute('y', district.y + district.h / 2 + 8);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#edf5ff');
    label.setAttribute('font-size', '20');
    label.setAttribute('font-weight', '700');
    label.setAttribute('letter-spacing', '0.08em');
    label.textContent = district.name;

    districtGroup.appendChild(rect);
    districtGroup.appendChild(label);

    rect.addEventListener('mouseenter', () => updateSelectedDistrict(district.id));
    rect.addEventListener('click', () => updateSelectedDistrict(district.id));
    rect.addEventListener('focus', () => updateSelectedDistrict(district.id));
    rect.setAttribute('tabindex', '0');
  });
}

function buildRoutes() {
  const routeCoords = [
    [220, 340, 1180, 180],
    [300, 520, 930, 330],
    [475, 150, 1100, 250],
    [390, 560, 760, 150]
  ];

  routeCoords.forEach(([x1, y1, x2, y2]) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 - 80}, ${x2} ${y2}`);
    line.setAttribute('class', 'route-line');
    routesGroup.appendChild(line);
  });
}

function buildLandmarks() {
  landmarks.forEach((landmark) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', landmark.x);
    circle.setAttribute('cy', landmark.y);
    circle.setAttribute('r', 8);
    circle.setAttribute('fill', '#ffd166');
    circle.setAttribute('class', 'landmark-shape');

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', landmark.x + 18);
    label.setAttribute('y', landmark.y - 12);
    label.setAttribute('class', 'landmark-label');
    label.textContent = landmark.name;

    landmarksGroup.appendChild(circle);
    landmarksGroup.appendChild(label);
  });
}

function updateSelectedDistrict(id) {
  const district = districtLookup[id];
  if (!district) return;

  districtName.textContent = district.name;
  districtDescription.textContent = district.description;
  missionList.innerHTML = district.missions.map((mission) => `<li>${mission}</li>`).join('');

  const districtRects = document.querySelectorAll('.district');
  districtRects.forEach((rect) => {
    const active = rect.dataset.id === id;
    rect.classList.toggle('active', active);
    rect.setAttribute('opacity', active ? '1' : '0.8');
  });
}

buildDistricts();
buildRoutes();
buildLandmarks();
updateSelectedDistrict('midtown');
