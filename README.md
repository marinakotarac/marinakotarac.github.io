# Mali princ - odrzavanje sajta

Ovaj projekat sada ima dve verzije prikaza:

- `index.html` je nova, aktivna naslovna strana sajta.
- `srpski.html` je nova strana za knjige na srpskom jeziku.
- `strani.html` je nova strana za knjige na drugim jezicima.
- `razmena.html` je posebna strana za knjige namenjene razmeni.

Glavni izvori podataka su:

- `assets/js/book-data-serbian.js`
- `assets/js/book-data-other.js`
- `assets/js/book-data-exchange.js`

Stilovi su u:

- `assets/css/site.css`

Logika prikaza, pretrage, statistike, mnozina i tema je u:

- `assets/js/site.js`


# 1. Kako su organizovane baze

Podaci su sada razdvojeni u tri posebna fajla:

- `assets/js/book-data-serbian.js`
- `assets/js/book-data-other.js`
- `assets/js/book-data-exchange.js`

To olaksava uredjivanje zato sto se srpska izdanja, strani jezici i knjige za razmenu menjaju odvojeno.

U fajlu `assets/js/book-data-serbian.js` nalazi se samo srpska baza.

U fajlu `assets/js/book-data-other.js` nalazi se samo baza za ostale jezike.

U fajlu `assets/js/book-data-exchange.js` nalazi se baza za razmenu.

Svaka baza ima istu strukturu:

- `slug`
- `title`
- `description`
- `items`

Najvazniji deo je `items`, zato sto se tu nalazi niz svih knjiga za tu bazu.

Svaka knjiga izgleda ovako:

```js
{
  "localName": "Srpski latinica",
  "englishName": "Serbian Latin",
  "title": "Mali princ",
  "wikiUrl": "https://en.wikipedia.org/wiki/Serbian_language",
  "coverImage": "naslovna/srpski-latinica.jpg",
  "coverThumb": "naslovna_th/srpski-latinica.jpg",
  "firstPageImage": "prva/srpski-latinica.jpg",
  "firstPageThumb": "prva_th/srpski-latinica.jpg"
}
```


# 2. Kako odluciti da li knjiga ide u srpsku, stranu ili exchange bazu

Pravilo u ovom projektu je jednostavno:

- Ako je izdanje na srpskom, ide u bazu `serbian`.
- Ako je izdanje na bilo kom drugom jeziku, ide u bazu `other`.
- Ako je knjiga namenjena razmeni, ide u bazu `exchange`, bez obzira na jezik.

Primeri za `serbian`:

- `Srpski latinica`
- `Srpski ćirilica`
- varijante i posebna srpska izdanja

Primeri za `other`:

- `Engleski`
- `Francuski`
- `Japanski`
- `Esperanto`
- bilo koji drugi nesrpski jezik

Primeri za `exchange`:

- duplikati iz kolekcije
- primerci namenjeni kolekcionarskoj razmeni
- knjige cije slike stoje u folderu `razmena/`


# 3. Kako dodati novu knjigu - korak po korak

## Korak 1: pripremi slike

Za svaku novu knjigu treba da postoje 4 slike:

- velika naslovna u folderu `naslovna/`
- thumbnail naslovne u folderu `naslovna_th/`
- velika prva strana u folderu `prva/`
- thumbnail prve strane u folderu `prva_th/`

Primer:

- `naslovna/novi-jezik.jpg`
- `naslovna_th/novi-jezik.jpg`
- `prva/novi-jezik.jpg`
- `prva_th/novi-jezik.jpg`

Bitno:

- Naziv fajla treba da bude isti u sva 4 foldera.
- Ekstenzija treba da bude ista svuda, na primer `.jpg`.
- Ako thumbnail ne postoji, prikaz ce puknuti za tu stavku.

Za bazu razmene ista logika vazi, samo se slike smestaju u:

- `razmena/naslovna/`
- `razmena/naslovna_th/`
- `razmena/prva/`
- `razmena/prva_th/`


## Korak 2: otvori odgovarajucu bazu podataka

Ako dodajes srpsku knjigu, otvori:

- `assets/js/book-data-serbian.js`

Ako dodajes knjigu na stranom jeziku, otvori:

- `assets/js/book-data-other.js`

Ako dodajes knjigu za razmenu, otvori:

- `assets/js/book-data-exchange.js`

U tom fajlu pronadji:

- `items`

Dodavanje nove knjige znaci da ubacis jos jedan objekat u odgovarajuci `items` niz unutar tog jednog fajla.


## Korak 3: izaberi odgovarajucu bazu

Ako je nova knjiga na srpskom jeziku, dodaj je u:

```js
window.BOOK_DATABASES_SERBIAN = {
  ...
  items: [
```

Ako je nova knjiga na stranom jeziku, dodaj je u:

```js
window.BOOK_DATABASES_OTHER = {
  ...
  items: [
```

Ako je knjiga za razmenu, dodaj je u:

```js
window.BOOK_DATABASES_EXCHANGE = {
  ...
  items: [
```


## Korak 4: dodaj novi slog

U odgovarajuci `items` niz dodaj novi objekat.

Primer za srpsku knjigu:

```js
{
  "localName": "Srpski latinica",
  "englishName": "Serbian Latin",
  "title": "Mali princ",
  "wikiUrl": "https://en.wikipedia.org/wiki/Serbian_language",
  "coverImage": "naslovna/moj-novi-fajl.jpg",
  "coverThumb": "naslovna_th/moj-novi-fajl.jpg",
  "firstPageImage": "prva/moj-novi-fajl.jpg",
  "firstPageThumb": "prva_th/moj-novi-fajl.jpg"
}
```

Primer za strani jezik:

```js
{
  "localName": "Portugalski jezik",
  "englishName": "Portuguese language",
  "title": "O Principezinho",
  "wikiUrl": "https://en.wikipedia.org/wiki/Portuguese_language",
  "coverImage": "naslovna/portugalski-novo.jpg",
  "coverThumb": "naslovna_th/portugalski-novo.jpg",
  "firstPageImage": "prva/portugalski-novo.jpg",
  "firstPageThumb": "prva_th/portugalski-novo.jpg"
}
```

Primer za razmenu:

```js
{
  "localName": "Francuski jezik",
  "englishName": "French language",
  "title": "Le Petit prince",
  "wikiUrl": "https://en.wikipedia.org/wiki/French_language",
  "coverImage": "razmena/naslovna/francuski_1.jpg",
  "coverThumb": "razmena/naslovna_th/francuski_1.jpg",
  "firstPageImage": "razmena/prva/francuski_1.jpg",
  "firstPageThumb": "razmena/prva_th/francuski_1.jpg"
}
```

Bitno:

- Obrati paznju na zareze izmedju slogova.
- Ako novi slog nije poslednji u nizu, mora imati zarez na kraju.
- Ako jeste poslednji, ne treba dodavati visak znakova mimo validnog JS formata.


# 4. Sta znaci svako polje

- `localName`: naziv jezika kako zelis da bude prikazan na sajtu
- `englishName`: naziv jezika ili objasnjenje na engleskom, prikazuje se kao link ka Wikipediji
- `title`: naslov knjige na tom jeziku
- `wikiUrl`: link ka odgovarajucoj Wikipedia stranici
- `coverImage`: velika slika naslovne
- `coverThumb`: mala slika naslovne
- `firstPageImage`: velika slika prve strane
- `firstPageThumb`: mala slika prve strane


# 5. Kako izmeniti postojecu knjigu

Ako hoces da promenis postojecu stavku:

1. Ako je srpska knjiga, otvori `assets/js/book-data-serbian.js`.
2. Ako je strana knjiga, otvori `assets/js/book-data-other.js`.
3. Ako je knjiga za razmenu, otvori `assets/js/book-data-exchange.js`.
4. Pronadji knjigu po imenu jezika ili po nazivu fajla slike.
5. Izmeni zeljeno polje.
6. Sacuvaj fajl.
7. Osvezi stranicu u browseru.

Najlakse pretrage su po:

- `localName`
- `englishName`
- nazivu fajla, na primer `srpski-latinica_vulkan2.jpg`


# 6. Kako obrisati knjigu

1. Ako je srpska knjiga, otvori `assets/js/book-data-serbian.js`.
2. Ako je strana knjiga, otvori `assets/js/book-data-other.js`.
3. Ako je knjiga za razmenu, otvori `assets/js/book-data-exchange.js`.
4. Pronadji ceo objekat te knjige.
5. Obrisi ceo objekat.
6. Proveri da li su zarezi ostali ispravni pre i posle tog mesta.
7. Sacuvaj fajl.

Ako zelis, posle toga mozes i rucno obrisati slike iz:

- `naslovna/`
- `naslovna_th/`
- `prva/`
- `prva_th/`

Ako je to knjiga iz razmene, slike su umesto toga u:

- `razmena/naslovna/`
- `razmena/naslovna_th/`
- `razmena/prva/`
- `razmena/prva_th/`

To nije obavezno za prikaz, ali je dobro za urednost projekta.


# 7. Kako radi sortiranje i pretraga

Sortiranje se ne podesava rucno po redosledu unosa.

Sajt automatski sortira stavke po:

- `localName`
- pa zatim po `title`

Pretraga radi ovako:

- Ako je polje prazno, prikazuju se sve knjige iz te baze.
- Kako se unosi tekst, ostaju samo jezici koji u nazivu imaju taj tekst.
- Pretraga gleda i `localName` i `englishName`.

To znaci da ne moras rucno da redjas knjige po abecedi kada ih dodajes.


# 8. Kako promeniti tekstove na sajtu

Tekstovi naslovne strane su u:

- `index.html`

Tekstovi zaglavlja za srpsku i stranu bazu delom dolaze iz HTML fajlova:

- `srpski.html`
- `strani.html`
- `razmena.html`

Tekstovi i opisi baza, kao i deo dvojezicnog prikaza, dolaze iz:

- `assets/js/book-data-serbian.js`
- `assets/js/book-data-other.js`
- `assets/js/book-data-exchange.js`

Tacnije iz polja:

- `window.BOOK_DATABASES_SERBIAN.description`
- `window.BOOK_DATABASES_OTHER.description`
- `window.BOOK_DATABASES_EXCHANGE.description`

Dodatna logika prikaza je u:

- `assets/js/site.js`

Tu su sada i:

- dvojezicni tekstovi za kartice na naslovnoj strani
- dvojezicni tekstovi za statistiku i pretragu
- pravilni oblici mnozine za srpski (`jezik`, `jezika`, `knjiga`, `knjige`)


# 9. Kratka provera posle svake izmene

Posle svake promene proveri sledece:

1. Da li se stranica otvara bez greske.
2. Da li nova knjiga postoji na pravoj strani, `srpski.html`, `strani.html` ili `razmena.html`.
3. Da li pretraga nalazi tu knjigu.
4. Da li rade linkovi ka Wikipediji.
5. Da li rade velika slika naslovne i velika slika prve strane.
6. Da li se thumbnailovi prikazuju ispravno.


# 10. Najcesce greske

- Slike nisu ubacene u sva 4 foldera.
- Naziv fajla nije isti u `naslovna`, `naslovna_th`, `prva`, `prva_th`.
- Pogresno stavljen zarez u `assets/js/book-data-serbian.js`, `assets/js/book-data-other.js` ili `assets/js/book-data-exchange.js`.
- Knjiga je greskom ubacena u `serbian`, `other` ili `exchange` pogresnu bazu.
- `wikiUrl` nije potpun link.


# 11. Napomena o popup prikazu slika

Na stranicama `srpski.html`, `strani.html` i `razmena.html` klik na thumbnail:

- ne otvara novi tab
- otvara veliku sliku kao popup preko strane
- zatvara se klikom bilo gde
- zatvara se i tasterom `Esc`


# 12. Trenutna struktura stranica

- `index.html` je dvojezicna naslovna strana sa sekcijama:
- `Kako je sve pocelo`
- `O kolekciji`
- `Cuvar digitalne biblioteke`

Na naslovnoj postoje 3 kartice:

- srpska izdanja
- izdanja na drugim jezicima
- knjige za razmenu

`srpski.html`, `strani.html` i `razmena.html` imaju:

- dvojezicno zaglavlje
- dvojezicne navigacione linkove
- dvojezicnu pretragu
- dvojezicnu statistiku rezultata
- dvojezicne oznake ispod thumbnail slika
