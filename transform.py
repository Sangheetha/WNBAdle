import json

class Player:
    def __init__(self, fullName, team, position, number, height, urlId):
        self.fullName = fullName
        self.team = team
        self.position = position
        self.number = number
        self.height = height
        self.urlId = urlId

def transformHeight(height):
    feet, inches = map(int,height.split("-"))
    return (feet*12 + inches)

f = open('wnbaplayers.json')

playersArray = json.load(f)
playersDict = {}

lastPlayer = playersArray[-1]

for player in playersArray:
    if player[6] == None:
        # Player is not currently on a team
        continue
    urlId = player[0]
    fullName = " ".join(player[1:3][::-1])
    team = " ".join(player[6:8])
    number = int(player[9])
    position = player[10]
    height = transformHeight(player[11])

    newPlayer = Player(fullName, team, position, number, height, urlId) 
    playersDict[fullName] = newPlayer.__dict__
    
with open('playerList.json', 'w') as f:
    json.dump(list(playersDict.keys()),f)

with open('playerData.json', 'w') as f:
    json.dump(playersDict, f)
