import random

class Device:
    device_list = []
    device_name_list = []
    powerUsage_dict = {}
    maxDevice = ""
    sum_list = []
    tier = ""
    entireTime = []
    entirePower = []
    inefficient_devices = []
    powerUsageSum = 0
    powerAvgPerDay = 0
    powerAvgPerWeek = 0
    powerAvgPerMonth = 0

    def __init__(self, name, port):
        Device.device_list.append(self)
        Device.device_name_list.append(name)
        self.name = name
        self.port = port
        self.watte = {} #1시간 단위 전력 소모량
        self.time = []
        self.power = []
        self.sum = 0
        self.avg = 0
        self.maxT = 0
        self.minT = 0
        self.energyGrade = 0
        self.energyEfficiency = 0 #단위: %
        
    def DeviceAppend(self, t, p):
        self.watte[t] = p
        self.time.append(t)
        self.power.append(p)

    #평균 전력 소모량
    def PowerUsageAvg(self):
        self.sum = sum(self.watte.values())
        Device.sum_list.append(self.sum) #총 전력 소모량, 전력 소모 티어 계산에 사용
        self.avg = self.sum/len(self.watte)

    #디바이스별 총 전력 소모량
    def dictUpdate(self):
        Device.powerUsage_dict[self] = self.sum
    
    #전력 소모량 최대 시간대
    def UsageMaxTime(self):
        self.maxT = max(self.watte, key=self.watte.__getitem__)
    
    #전력 소모량 최소 시간대
    def UsageMinTime(self):
        self.minT = min(self.watte, key=self.watte.__getitem__)

    #에너지 소비 효율 등급
    def EnergyGrades(self):
        self.energyGrade = random.randint(1, 5)
        if self.energyGrade == 1:
            self.energyEfficiency = random.randint(1, 20)
        elif self.energyGrade == 2:
            self.energyEfficiency = random.randint(21, 40)
        elif self.energyGrade == 3:
            self.energyEfficiency = random.randint(41, 60)
        elif self.energyGrade == 4:
            self.energyEfficiency = random.randint(61, 80)
        else:
            self.energyEfficiency = random.randint(81, 100)

    #인스턴스 속성 함수 업데이트
    def update(self, t, p):
        self.DeviceAppend(t, p)
        self.dictUpdate()
        self.PowerUsageAvg()
        self.UsageMaxTime()
        self.UsageMinTime()
        self.EnergyGrades()

        return [self.name, self.power[-1], self.time[-1], self.sum, self.avg, self.maxT, self.minT, self.energyGrade]

    #전력 소모량 최대 디바이스
    @staticmethod
    def UsageMaxDevice():
        Device.maxDevice = max(Device.powerUsage_dict, key=Device.powerUsage_dict.__getitem__)

    #총 전력 소모량
    @staticmethod
    def PowerUsage():
        Device.powerUsageSum = sum(Device.sum_list)

    #전력 소모 티어
    @staticmethod
    def Tier():
        Device.tier = Device.PowerUsage()/4 #4인 가구 기준 인당 전력 소모량
    
    #시간별 총전력 소모량
    @staticmethod
    def PowerUsagePerHour():
        alltimes = [obj.time for obj in Device.device_list]
        Device.entireTime = list(set().union(*alltimes)).sort()
        Device.entirePower = [sum([obj.watte[t] for obj in Device.device_list if t in obj.watte]) for t in Device.entireTime]

    #일별, 주간별, 월별 평균 전력 소모량
    @staticmethod
    def PowerUsageAvgPerTime():
        if len(Device.entireTime)>=24*30:
            Device.powerAvgPerDay=Device.PowerUsage()/(len(Device.entireTime)/24)
            Device.powerAvgPerWeek=Device.PowerUsage()/(len(Device.entireTime)/24*7)
            Device.powerAvgPerMonth=Device.PowerUsage()/(len(Device.entireTime)/24*30)
        elif len(Device.entireTime)>=24*7:
            Device.powerAvgPerDay=Device.PowerUsage()/(len(Device.entireTime)/24)
            Device.powerAvgPerWeek=Device.PowerUsage()/(len(Device.entireTime)/24*7)
        elif len(Device.entireTime)>=24:
            Device.powerAvgPerDay=Device.PowerUsage()/(len(Device.entireTime)/24)

    #비효율 장치 관리
    @staticmethod
    def InefficientDevice():
        for obj in Device.device_list:
            if len(obj.time) >= 24*7*2: #이전 1주일 데이터와 비교하여 비효율 장치 선정
                before2WeekUsage=sum(obj.power[-24*7*2:-24*7])/24*7
                before1WeekUsage=sum(obj.power[-24*7:])/24*7
                if(abs(before1WeekUsage-before2WeekUsage) > 100):
                    Device.inefficient_devices.append(obj)

    #클래스 속성 함수 업데이트
    @staticmethod
    def ClassUpdate():
        Device.UsageMaxDevice()
        Device.PowerUsage()
        Device.Tier()
        Device.PowerUsagePerHour()
        Device.PowerUsageAvgPerTime()
        Device.InefficientDevice()