const folders = [
  { path: 'warframe', tabName: 'Warframe' },
  { path: 'primary', tabName: 'Primary' },
  { path: 'secondary', tabName: 'Secondary' },
  { path: 'melee', tabName: 'Melee' },
  { path: 'companion', tabName: 'Companion' },
  { path: 'vehicle', tabName: 'Vehicle' },
  { path: 'amp', tabName: 'Amp' }
];

const baseUrl = "https://wiki.warframe.com/w/"

const STORAGE_VERSION = 1

let savedData = new Map(
  JSON.parse(localStorage.getItem(`data_v${STORAGE_VERSION}`)) || []
);

window.onload = async () => {
  const tabButtons = document.getElementById('tabButtons');
  const tabContents = document.getElementById('tabContents');

  const allData = [];

  const folderData = await Promise.all(
    folders.map(async ({ path, tabName }) => {
      const files = await getJsonFiles(path);
      const data = await Promise.all(
        files.map(({ fullPath, type, subtype }) =>
          fetch(fullPath)
            .then(res => res.json())
            .then(items => items.map(item => ({ ...item, type, subtype })))
            .catch(err => {
              console.error(`Error loading ${fullPath}:`, err);
              return [];
            })
        )
      );

      const combined = data.flat();
      allData.push(...combined);

      return { tabName, data: combined.sort((a, b) => a.name.localeCompare(b.name)) };
    })
  );

  createTab('All', allData.sort((a, b) => a.name.localeCompare(b.name)), true);

  folderData.forEach(({ tabName, data }) => createTab(tabName, data, false));
};

async function getJsonFiles(path) {
  const filesMap = {
    'warframe': [
      'Simple.json',
      'Prime.json'
    ],
    'primary': [
      "Bow.json",
      "Kuva.json",
      "Launcher.json",
      "MK1.json",
      "Prime.json",
      "Rifle.json",
      "Shotgun.json",
      "Sniper.json",
      "Tenet.json"
    ],
    'secondary': [
      "Dual.json",
      "Kitgun.json",
      "Kuva.json",
      "MK1.json",
      "Prime.json",
      "Single.json",
      "Tenet.json",
      "Thrown.json"
    ],
    'melee': [
      "Assault Saw.json",
      "Claws.json",
      "Dagger.json",
      "Dual Daggers.json",
      "Dual Swords.json",
      "Fist.json",
      "Glaive.json",
      "Gunblade.json",
      "Hammer.json",
      "Heavy Blade.json",
      "Heavy Scythe.json",
      "Kuva.json",
      "Machete.json",
      "MK1.json",
      "Polearm.json",
      "Prime.json",
      "Rapier.json",
      "Scythe.json",
      "Sword-Shield.json",
      "Sword.json",
      "Tenet.json",
      "Tonfa.json",
      "Warfan.json",
      "Whip.json",
      "Zaw.json"
    ],
    'companion': [
      'Sentinel.json',
      'Robotic Weapon.json',
      'Prime Sentinel.json',
      'Prime Robotic Weapon.json',
      'Kubrow.json',
      'Kavat.json',
      'Moa.json',
      'Predasite.json',
      'Vulpaphyla.json',
      'Hound.json'
    ],
    'vehicle': [
      'Archwing.json',
      'Prime.json',
      'Arch-gun.json',
      'Arch-melee.json',
      'K-drive.json',
      'Necramech.json'
    ],
    'amp': ['Amp.json'],
  };

  return (filesMap[path]).map(filename => (
    {
      fullPath: `assets/data/${path}/${filename}`,
      type: path.charAt(0).toUpperCase() + path.slice(1),
      subtype: filename.replace('.json', ''),
    }
  ));
}