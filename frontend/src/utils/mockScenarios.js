const mockScenarios = [
  {
    id: "112202603120123456789",
    title: "Családi ház tűzeset",
    audioFileName: "tuzeset_01.mp3",
    address: "3300 Eger, Kossuth Lajos utca 12.",
    expectedNote:
      "A bejelentő szerint családi ház tetőszerkezete ég, két fő tartózkodhat az ingatlanban.",
    requiredUnits: ["Heves VMKI", "OMSZ Heves", "Heves VMRFK"],
    category: "Tűzeset",
  },
  {
    id: "112202603110987654321",
    title: "Egészségügyi rosszullét",
    audioFileName: "rosszullet_02.mp3",
    address: "3525 Miskolc, Széchenyi utca 8.",
    expectedNote:
      "Idős nő hirtelen rosszul lett, nehézlégzésre és mellkasi fájdalomra panaszkodik.",
    requiredUnits: ["OMSZ BAZ", "BAZ VMRFK"],
    category: "Egészségügyi eset",
  },
  {
    id: "112202603081112223334",
    title: "Közlekedési baleset",
    audioFileName: "baleset_03.mp3",
    address: "4400 Nyíregyháza, Debreceni út 101.",
    expectedNote:
      "Két személyautó ütközött, az egyik járműben egy személy beszorult.",
    requiredUnits: ["SzSzB VMKI", "OMSZ SzSzB", "SzSzB VMRFK"],
    category: "Közlekedési baleset",
  },
];

export default mockScenarios;