class busStopConfig:
    busNumber = 0
    stopName = ''
    stopId = ''
    stopNumber = 0
    displayColor = (0,0,0)
    
    def __init__(self, busNumber=0, stopName='', stopId='', stopNumber=0, displayColor=(0,0,0)):
        self.busNumber = busNumber
        self.stopName = stopName
        self.stopId = stopId
        self.stopNumber = stopNumber
        self.displayColor = displayColor
        
    def __str__(self):
        return ("Bus #" + str(self.busNumber) + " - Stop " + self.stopId + " " + self.stopName + " @ " + str(self.stopNumber))
    
    def __repr__(self):
        return ("Bus #" + str(self.busNumber) + " - Stop " + self.stopId + " " + self.stopName + " @ " + str(self.stopNumber))
    
    def __hash__(self):
        return hash((self.busNumber, self.stopName, self.stopId,  self.stopNumber))

    def __eq__(self, other):
        return (self.busNumber, self.stopName, self.stopId,  self.stopNumber) == (other.busNumber, other.stopName, other.stopId,  other.stopNumber)

    def __ne__(self, other):
        # Not strictly necessary, but to avoid having both x==y and x!=y
        # True at the same time
        return not(self == other)
