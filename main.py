import mysql.connector
import geopy
from geopy import distance
def sqlhaku(query):
    kursori = yhteys.cursor()
    kursori.execute(query)
    tulos = kursori.fetchone()
    return tulos
def valimatka(icao1, icao2):
    location1 = sqlhaku(f"SELECT latitude_deg, longitude_deg FROM airport WHERE ident='{icao1}'")
    location2 = sqlhaku(f"SELECT latitude_deg, longitude_deg FROM airport WHERE ident='{icao2}'")
    return geopy.distance.distance(location1, location2)
yhteys = mysql.connector.connect(
    host='localhost',
    port='3306',
    database='flight_game',
    user='Lieto',
    password='test',
    autocommit=True
)
#firstICAO = input("Enter the ICAO code of the first airport: ")
#secondICAO = input("Enter the ICAO code of the second airport: ")
#print(f"Distance between {firstICAO} and {secondICAO}: {valimatka(firstICAO, secondICAO)}")
