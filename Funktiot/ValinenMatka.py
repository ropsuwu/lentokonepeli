import mysql.connector
from geopy.distance import geodesic

conn = mysql.connector.connect(
    host='localhost',
    port='3306',
    database='flight_game',
    user='',
    password='',
    autocommit=True
)
cursor = conn.cursor()
cursor.execute("SELECT c.name, a.latitude, a.longitude FROM countries c JOIN airports a ON c.id = a.country_id")
countries = cursor.fetchall()

def Lahimmat(location, country_list, i=1):
    distances = []
    for name, lat, lon in country_list:
        dist = geodesic(location, (lat, lon)).kilometers
        distances.append((name, dist, (lat, lon)))
    distances.sort(key=lambda x: x[1])
    return distances[:i]

Lokaatio = (0,0)
LahimmatMaat = Lahimmat(Lokaatio, countries, i=1)[0]
print(f"Lähimmat maat: {LahimmatMaat[0]} ({LahimmatMaat[1]:.2f} km)")
Lokaatio = LahimmatMaat[2]

KolmeMaata = Lahimmat(Lokaatio, countries, i=4)
KolmeMaata = KolmeMaata[1:4]

print("Kolme lähintä maata: ")
for name, dist in KolmeMaata:
    print(f"- {name} ({dist:.2f} km)")