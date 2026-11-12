// FISH DATA: every question uses an image, name, three hints and a fact from this roster.
const FishData = (() => {
  const list = [
    { level: 1, name: 'Clownfish', imageFile: 'clown fish.jpg', hints: ['Orange body with three white bands edged in black', 'Often lives among sea anemone tentacles', 'Native to warm waters of the Pacific and Indian Oceans'], fact: 'Clownfish live among anemone tentacles, which protect them from many predators.' },
    { level: 1, name: 'Blue Tang', imageFile: 'Blue Tang.jpg', hints: ['Bright blue body and yellow tail', 'A sharp, scalpel-like spine sits near its tail', 'Feeds mainly on algae around coral reefs'], fact: 'This reef fish has a sharp spine near its tail that it uses for defence.' },
    { level: 1, name: 'Pufferfish', imageFile: 'pufferfish.jpg', hints: ['Can inflate its body when threatened', 'Has a small mouth with strong, beak-like teeth', 'Some species contain a powerful toxin'], fact: 'Inflating makes a pufferfish harder for predators to swallow.' },
    { level: 1, name: 'Goldfish', imageFile: 'goldfish.jpg', hints: ['A familiar orange or golden freshwater fish', 'Often kept in ponds and home aquariums', 'Descended from a wild carp'], fact: 'Goldfish were domesticated from carp in China more than a thousand years ago.' },
    { level: 1, name: 'Betta', imageFile: 'betta.jpg', hints: ['Known for long, flowing fins and vivid colours', 'Males can be territorial toward other males', 'Can breathe air at the water surface'], fact: 'Bettas use a labyrinth organ to breathe air from the water surface.' },

    { level: 2, name: 'Blue Guppy', imageFile: 'blue guppy.jpg', hints: ['Small, colourful freshwater fish with a fan-shaped tail', 'Males are usually brighter and more patterned than females', 'Gives birth to live young rather than laying eggs'], fact: 'Guppies are livebearers: females give birth to free-swimming young.' },
    { level: 2, name: 'Butterfly Fish', imageFile: 'butterfly fish.jpg', hints: ['Thin, oval reef fish with bright patterns', 'Many species have a dark stripe through the eye', 'Often seen near coral in tropical oceans'], fact: 'Butterflyfish use their narrow snouts to pick small prey from reef crevices.' },
    { level: 2, name: 'Carp', imageFile: 'carp.jpg', hints: ['Large freshwater fish with barbels near its mouth', 'Often found in lakes, ponds and slow rivers', 'The wild ancestor of the familiar goldfish'], fact: 'Carp are adaptable freshwater fish that have been raised by people for centuries.' },
    { level: 2, name: 'Catfish', imageFile: 'catfish.jpg', hints: ['Has whisker-like barbels around its mouth', 'Many species live near the bottom of rivers or lakes', 'Uses its sensitive barbels to find food'], fact: 'Catfish barbels help them sense food in murky water and along the bottom.' },
    { level: 2, name: 'Discus', imageFile: 'discus.jpg', hints: ['Round, flattened body, like a disc', 'Native to the Amazon basin in South America', 'Parents care for their young and provide skin mucus as food'], fact: 'Discus parents feed their fry with nutritious mucus from their skin.' },
    { level: 2, name: 'Dolphin', imageFile: 'dolphin.jpg', hints: ['A warm-blooded marine mammal, not a fish', 'Breathes air through a blowhole on top of its head', 'Uses clicks and whistles to communicate and navigate'], fact: 'Dolphins are mammals that breathe air and nurse their young.' },
    { level: 2, name: 'Gourami', imageFile: 'gourami.jpg', hints: ['Freshwater fish native to Asia', 'Has long, thread-like pelvic fins', 'Can take air from the surface using a labyrinth organ'], fact: 'Like bettas, gouramis can breathe air using a labyrinth organ.' },
    { level: 2, name: 'Koi', imageFile: 'koi.jpg', hints: ['Decorative variety of carp with bright colour patterns', 'Often kept in garden ponds', 'Individual fish can live for many decades with good care'], fact: 'Koi are ornamental carp bred for their striking colours and patterns.' },
    { level: 2, name: 'Rainbowfish', imageFile: 'Rainbowfish.jpg', hints: ['Small freshwater fish with shimmering colours', 'Native to Australia and nearby islands', 'Its colours can look brighter when it is active or displaying'], fact: 'Rainbowfish are known for reflective scales that shimmer as they move.' },
    { level: 2, name: 'Sea Urchin', imageFile: 'sea uchin.jpg', hints: ['A round marine animal covered in movable spines', 'Grazes on algae using a distinctive jaw structure', 'Despite its name, it is not a fish'], fact: 'Sea urchins are echinoderms, related to sea stars and sea cucumbers.' },

    { level: 3, name: 'Jellyfish', imageFile: 'jellyfish.jpg', hints: ['Has a soft, bell-shaped body and trailing tentacles', 'Uses stinging cells to catch prey and defend itself', 'Has no bones, brain or heart'], fact: 'Jellyfish use stinging cells on their tentacles to capture small prey.' },
    { level: 3, name: 'Octopus', imageFile: 'octopus.jpg', hints: ['A soft-bodied animal with eight arms', 'Can change colour and texture to blend in', 'Uses a hard beak to bite and handle food'], fact: 'Octopuses can camouflage by changing the colour and texture of their skin.' },
    { level: 3, name: 'Prawn', imageFile: 'prawn.jpg', hints: ['A small crustacean with a segmented body and antennae', 'Has a hard outer shell that it sheds as it grows', 'Uses several pairs of legs to move and handle food'], fact: 'Prawns grow by shedding their old outer shell and forming a larger one.' },
    { level: 3, name: 'Queen Angelfish', imageFile: 'queen angelfish.jpg', hints: ['Colourful Caribbean reef fish with blue and yellow markings', 'A dark spot on its forehead resembles a crown', 'Feeds on sponges and other small reef organisms'], fact: 'The queen angelfish gets its name from the crown-like marking on its head.' },
    { level: 3, name: 'Seahorse', imageFile: 'seahorse.jpg', hints: ['Swims upright and has a curled, grasping tail', 'Uses its long snout to suck up tiny prey', 'The male carries developing young in a pouch'], fact: 'Male seahorses carry developing young in a brood pouch.' },
    { level: 3, name: 'Shark', imageFile: 'shark.jpg', hints: ['A fish with a skeleton made mostly of cartilage', 'Breathes through gill slits on the sides of its head', 'Continually replaces many of its teeth'], fact: 'A shark’s skeleton is made of flexible cartilage rather than bone.' },
    { level: 3, name: 'Squid', imageFile: 'squid.jpg', hints: ['Has eight arms and two longer feeding tentacles', 'Moves quickly by pushing water through a siphon', 'Can release ink to confuse a predator'], fact: 'Squid can jet away by forcing water through a siphon.' },
    { level: 3, name: 'Starfish', imageFile: 'starfish.jpg', hints: ['A marine animal, also called a sea star', 'Usually has five arms, though some have more', 'Moves using hundreds of tiny tube feet'], fact: 'Sea stars move using tube feet powered by a water-based system.' },
    { level: 3, name: 'Stingray', imageFile: 'stingray.jpg', hints: ['A flat-bodied relative of sharks', 'Has broad fins that look like wings', 'Many species have a defensive spine on the tail'], fact: 'Stingrays are cartilaginous fish related to sharks.' },
    { level: 3, name: 'Tilapia', imageFile: 'thilapia.jpg', hints: ['Freshwater fish often raised in aquaculture', 'Many species are native to Africa', 'Some parents protect eggs and young inside the mouth'], fact: 'Several tilapia species protect their eggs or young by carrying them in the mouth.' },
    { level: 3, name: 'Tuna', imageFile: 'tuna.jpg', hints: ['Fast, powerful ocean fish with a streamlined body', 'Travels long distances in the open sea', 'Some species maintain warmer body temperatures than the surrounding water'], fact: 'Some tuna can keep parts of their bodies warmer than the surrounding seawater.' },
    { level: 3, name: 'Zebra Danio', imageFile: 'zibra danio.jpg', hints: ['Small freshwater fish marked with horizontal stripes', 'Native to streams in South Asia', 'A popular aquarium fish and research species'], fact: 'Zebrafish are widely studied because their embryos develop outside the body and are easy to observe.' }
  ];

  function image(f) {
    const img = document.createElement('img');
    img.src = `game images/${encodeURIComponent(f.imageFile)}`;
    img.alt = f.name;
    return img;
  }

  const mystery = '<svg viewBox="0 0 320 200" role="img" aria-label="Mystery fish"><text x="160" y="170" text-anchor="middle" font-size="190" font-weight="900" font-family="Nunito,Arial,sans-serif" fill="#e8402a" stroke="#a82210" stroke-width="4">?</text></svg>';

  return {
    list,
    image,
    mystery,
    byLevel: level => list.filter(fish => fish.level === level),
    byName: name => list.find(fish => fish.name === name)
  };
})();
