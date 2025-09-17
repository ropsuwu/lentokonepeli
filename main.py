import mysql.connector
import geopy
from geopy import distance
def sqlquery(query):
    cursor = sqlconnection.cursor()
    cursor.execute(query)
    result = cursor.fetchone()
    return result
def valimatka(icao1, icao2):
    location1 = sqlquery(f"SELECT latitude_deg, longitude_deg FROM airport WHERE ident='{icao1}'")
    location2 = sqlquery(f"SELECT latitude_deg, longitude_deg FROM airport WHERE ident='{icao2}'")
    return geopy.distance.distance(location1, location2)
sqlconnection = mysql.connector.connect(
    host='localhost',
    port='3306',
    database='flight_game',
    user='',
    password='',
    autocommit=True
)
#firstICAO = input("Enter the ICAO code of the first airport: ")
#secondICAO = input("Enter the ICAO code of the second airport: ")
#print(f"Distance between {firstICAO} and {secondICAO}: {valimatka(firstICAO, secondICAO)}")
