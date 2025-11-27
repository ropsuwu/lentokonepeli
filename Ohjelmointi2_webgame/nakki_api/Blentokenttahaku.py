
from geopy import distance
import GameLoop
import main
# Hakee pelaajan nykyisen sijainnin tietokannasta.
# Funktio etsii pelaajan sijainnin game:sta, yhdistää sen airport:iin ja palauttaa sijainnin pituus- ja leveysasteet.

#player_id = 1

def pelaajan_sijainti(currentAirport):
    return main.sqlquery(f"SELECT latitude_deg, longitude_deg FROM airport WHERE name = '{currentAirport}'")[0]


# Hakee kaikki suuret lentokentät ja niiden maat. Palauttaa listan: (kentän nimi, maan nimi, lat, lon).
def get_large_airports():
    return main.sqlquery("SELECT a.name, c.name AS country_name, a.latitude_deg, a.longitude_deg, a.ident FROM airport a JOIN country c ON a.iso_country = c.iso_country WHERE a.type = 'large_airport'")


# Laskee ja palauttaa lähimmät suuret lentokentät pelaajan sijainnista.
def find_nearest_large_airports(currentAirport, sausagesFound, limit=3):
    player_coords = pelaajan_sijainti(currentAirport)

    player_pos = (player_coords[0], player_coords[1])

    airports = get_large_airports()
    results = []

    for name, country, lat, lon, icao in airports:
        airport_pos = (lat, lon)
        dist_km = distance.distance(player_pos, airport_pos).kilometers

        # Pelaajan oma kenttä ohitetaan
        if dist_km == 0:
            continue

        if sausagesFound.__contains__(country):
            continue

        results.append((name, country, dist_km, icao))

    results.sort(key=lambda x: x[2])
    return results[:limit]


# Tulostaa pelaajalle lähimmät suuret lentokentät.
def run_nearest_airports(currentAirport, sausagesFound, mods):
    nearest = find_nearest_large_airports(currentAirport, sausagesFound)
    if nearest:
        GameLoop.printtext("Closest 3 airports with sausages:", mods)
        for name, country, dist, icao in nearest:
            GameLoop.printtext(f"{name} ({icao}) in {country} - {dist:.2f} km", mods)


#run_nearest_airports(player_id)
