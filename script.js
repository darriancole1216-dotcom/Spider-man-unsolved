const districts = [
  {
    id: 'midtown',
    name: 'Midtown',
    points: '560,130 770,110 930,180 940,380 670,430 470,330 500,180',
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
    id: 'harlem',
    name: 'Harlem',
    points: '465,140 560,130 500,180 470,330 370,280 370,180',
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
    points: '300,130 370,180 370,280 240,310 200,200 250,135',
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
    points: '170,350 360,330 430,420 420,560 260,620 120,560 100,420',
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
    id: 'downtown',
    name: 'Downtown',
    points: '670,430 940,380 1030,470 1010,650 710,660 610,560',
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
    id: 'queens',
    name: 'Queens',
    points: '70,290 200,200 250,135 300,130 240,310 120,420 60,390',
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
  { name: 'Empire State', x: 760, y: 210 },
  { name: 'Brooklyn Bridge', x: 410, y: 470 },
  { name: 'Queensboro', x: 270, y: 250 },
  { name: 'Hudson', x: 930, y: 560 },
  { name: 'Battery', x: 878, y: 660 }
];

const districtLookup = Object.fromEntries(districts.map((d) => [d.id, d]));

const districtGroup = document.getElementById('districts');
const routesGroup = document.getElementById('routes');
const landmarksGroup = document.getElementById('landmarks');
const waterwaysGroup = document.getElementById('waterways');
const districtName = document.getElementById('district-name');
const districtDescription = document.getElementById('district-description');
const missionList = document.getElementById('district-missions');

function buildWaterways() {
  const water = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  water.setAttribute('d', 'M 860 0 L 1200 0 L 1200 760 L 860 760 Q 930 650 920 520 Q 930 350 1040 210 Q 1090 150 1200 120 L 1200 0 Z');
  water.setAttribute('class', 'water-blob');
  waterwaysGroup.appendChild(water);

  const riverBand = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  riverBand.setAttribute('d', 'M 890 60 Q 980 160 980 260 Q 980 420 1060 560 Q 1110 650 1200 720');
  riverBand.setAttribute('fill', 'none');
  riverBand.setAttribute('stroke', 'rgba(170, 222, 255, 0.32)');
  riverBand.setAttribute('stroke-width', '3');
  riverBand.setAttribute('stroke-dasharray', '10 14');
  waterwaysGroup.appendChild(riverBand);
}

function buildRoadGrid() {
  const roads = [
    'M 80 520 L 1120 520',
    'M 120 300 L 1100 300',
    'M 200 120 L 200 680',
    'M 480 70 L 480 700',
    'M 760 80 L 760 700',
    'M 960 100 L 960 760',
    'M 320 180 L 1080 180',
    'M 180 620 L 1030 620'
  ];

  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  roads.forEach((path) => {
    const road = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    road.setAttribute('d', path);
    road.setAttribute('class', 'road-grid');
    gridGroup.appendChild(road);
  });
  districtGroup.parentNode.insertBefore(gridGroup, districtGroup);
}

function buildDistricts() {
  districts.forEach((district) => {
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', district.points);
    polygon.setAttribute('fill', district.fill);
    polygon.setAttribute('opacity', '0.85');
    polygon.setAttribute('class', 'district-area');
    polygon.setAttribute('data-id', district.id);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const [cx, cy] = getPolygonCenter(district.points);
    label.setAttribute('x', cx);
    label.setAttribute('y', cy + 8);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#edf5ff');
    label.setAttribute('font-size', '18');
    label.setAttribute('font-weight', '700');
    label.setAttribute('letter-spacing', '0.08em');
    label.textContent = district.name;

    districtGroup.appendChild(polygon);
    districtGroup.appendChild(label);

    polygon.addEventListener('mouseenter', () => updateSelectedDistrict(district.id));
    polygon.addEventListener('click', () => updateSelectedDistrict(district.id));
    polygon.addEventListener('focus', () => updateSelectedDistrict(district.id));
    polygon.setAttribute('tabindex', '0');
  });
}

function getPolygonCenter(pointsString) {
  const nums = pointsString.split(' ').map((pair) => pair.split(',').map(Number));
  const xs = nums.map(([x]) => x);
  const ys = nums.map(([, y]) => y);
  return [xs.reduce((a, b) => a + b, 0) / nums.length, ys.reduce((a, b) => a + b, 0) / nums.length];
}

function buildRoutes() {
  const routeCoords = [
    [160, 420, 1080, 220],
    [230, 570, 1030, 480],
    [430, 160, 880, 260],
    [430, 560, 760, 210]
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

  const districtPolygons = document.querySelectorAll('.district-area');
  districtPolygons.forEach((polygon) => {
    const active = polygon.dataset.id === id;
    polygon.classList.toggle('active', active);
    polygon.setAttribute('opacity', active ? '1' : '0.8');
  });
}

buildWaterways();
buildRoadGrid();
buildDistricts();
buildRoutes();
buildLandmarks();
updateSelectedDistrict('midtown');
