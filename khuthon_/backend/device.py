import random
from collections import Counter

class Device:
    device_list = []
    device_name_list = []
    device_port_list = []
    powerUsage_dict = {} #sum_list와 같은 애인데...있는거 까먹고 또 만듬
    maxDevice = ""
    sum_list = {} #디바이스별 총 전력 소모량
    tier = ""
    entireTime = []
    entirePower = []
    inefficient_devices = []
    powerUsageSum = 0
    electricBill = 0
    powerUsageSumPerMonth = 0
    powerAvgPerDay = 0
    powerAvgPerWeek = 0
    powerAvgPerMonth = 0
    PeakMaxTime = 0
    PeakMinTime = 0
    power_counter = Counter()
    powerDiff = 0

    def __init__(self, name, port):
        Device.device_list.append(self)
        Device.device_name_list.append(name)
        Device.device_port_list.append(port)
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
        self.powerAvgPerDay = 0
        self.powerAvgPerWeek = 0
        self.powerAvgPerMonth = 0
        self.energyEfficiency = 0 #단위: %
        
    def DeviceAppend(self, t, p):
        self.watte[t] = p
        self.time.append(t)
        self.power.append(p)

    #평균 전력 소모량
    def PowerUsageAvg(self):
        self.sum = sum(self.watte.values())
        Device.sum_list[self] = self.sum #총 전력 소모량, 전력 소모 티어 계산에 사용
        self.avg = self.sum/len(self.watte)
        return self.avg

    #디바이스별 총 전력 소모량
    def dictUpdate(self):
        Device.powerUsage_dict[self] = self.sum
    
    #전력 소모량 최대 시간대
    def UsageMaxTime(self):
        self.maxT = max(self.watte, key=self.watte.__getitem__)
        return self.maxT%24
    
    #전력 소모량 최소 시간대
    def UsageMinTime(self):
        self.minT = min(self.watte, key=self.watte.__getitem__)
        return self.minT%24

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

        #에너지 효율 등급이 3등급 이상이면, 제품 업그레이드 권장
        return self.energyEfficiency
        
    def EachPowerUsageAvgPerTime(self):
        day=24/10000
        week=24*7/10000
        month=24*30/10000

        if len(self.time)>=month:
            self.powerAvgPerDay=sum(self.power)//(len(self.time)/day)
            self.powerAvgPerWeek=sum(self.power)//(len(self.time)/week)
            self.powerAvgPerMonth=sum(self.power)//(len(self.time)/month)
        elif len(self.time)>=week:
            self.powerAvgPerDay=sum(self.power)//(len(self.time)/day)
            self.powerAvgPerWeek=sum(self.power)//(len(self.time)/week)
        elif len(self.time)>=day:
            self.powerAvgPerDay=sum(self.power)//(len(self.time)/day)

        return [self.powerAvgPerDay, self.powerAvgPerWeek, self.powerAvgPerMonth]
    
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
        if len(Device.powerUsage_dict) == 0:
            return 0
        Device.maxDevice = max(Device.powerUsage_dict, key=Device.powerUsage_dict.__getitem__)
        return [Device.maxDevice.name, Device.maxDevice.sum, Device.maxDevice.avg]

    #총 전력 소모량
    @staticmethod
    def PowerUsage():
        Device.powerUsageSum = sum(Device.sum_list.values())
        return Device.powerUsageSum

    #전력 소모 티어
    @staticmethod
    def Tier():
        Device.tier = Device.powerUsageSum//4 #4인 가구 기준 인당 전력 소모량
    
    #시간별 총전력 소모량
    @staticmethod
    def PowerUsagePerHour():
        for device in Device.device_list:
            Device.power_counter.update(device.watte)

        # Counter 객체를 시간별로 정렬하여 시간과 해당 시간의 전력을 분리
        sorted_times = sorted(Device.power_counter)
        Device.entireTime = sorted_times
        Device.entirePower = [Device.power_counter[time] for time in sorted_times]

    #이번달 전기 요금 예측
    @staticmethod
    def CalElectricBills():
        month=24
        day = len(Device.entireTime)%month #이번달의 지난 날 수 ex) 100일 지난 상태면 이번 달은 10일이 지남.
        Device.powerUsageSumPerMonth=sum(Device.entirePower[-day:])
        Device.electricBill=Device.powerUsageSumPerMonth*12/10000

        return Device.electricBill

    #전력 소모량 최대, 최소 시간대
    @staticmethod
    def PowerPeakTime():
        if len(Device.power_counter) == 0:
            return
        Device.PeakMaxTime = max(Device.power_counter, key=Device.power_counter.__getitem__)
        Device.PeakMinTime = min(Device.power_counter, key=Device.power_counter.__getitem__)
        
        return [Device.PeakMaxTime, Device.PeakMinTime]

    #일별, 주간별, 월별 평균 전력 소모량
    @staticmethod
    def PowerUsageAvgPerTime():
        day=24/10000
        week=24*7/10000
        month=24*30/10000

        if len(Device.entireTime)>=month:
            Device.powerAvgPerDay=Device.PowerUsage()//(len(Device.entireTime)/day)
            Device.powerAvgPerWeek=Device.PowerUsage()//(len(Device.entireTime)/week)
            Device.powerAvgPerMonth=Device.PowerUsage()//(len(Device.entireTime)/month)
        elif len(Device.entireTime)>=week:
            Device.powerAvgPerDay=Device.PowerUsage()//(len(Device.entireTime)/day)
            Device.powerAvgPerWeek=Device.PowerUsage()//(len(Device.entireTime)/week)
        elif len(Device.entireTime)>=day:
            Device.powerAvgPerDay=Device.PowerUsage()//(len(Device.entireTime)/day)

        return [Device.powerAvgPerDay, Device.powerAvgPerWeek, Device.powerAvgPerMonth]

    #비효율 장치 관리
    @staticmethod
    def InefficientDevice():
        week = 24*7
        for obj in Device.device_list:
            if len(obj.time) >= week*2: #이전 1주일 데이터와 비교하여 비효율 장치 선정
                before2WeekUsage=sum(obj.power[-week*2:-week])/week
                before1WeekUsage=sum(obj.power[-week:])/week
                if(abs(before1WeekUsage-before2WeekUsage) > 100):
                    Device.inefficient_devices.append(obj)

    #지난 달 대비 전력 사용량
    @staticmethod
    def ComparePowerUsage():
        month = 24*30
        Device.powerDiff = sum(Device.entirePower[-2*month:-month])-sum(Device.entirePower[-month:])
        return Device.powerDiff
    
    @staticmethod
    def AllUsage():
        all_list = []
        for i in Device.device_list:
            all_list.append(i.sum)
        all_list.sort()
        return all_list

    #클래스 속성 함수 업데이트
    @staticmethod
    def ClassUpdate():
        Device.UsageMaxDevice()
        Device.PowerUsage()
        Device.Tier()
        Device.PowerUsagePerHour()
        Device.PowerPeakTime()
        Device.CalElectricBills()
        Device.PowerUsageAvgPerTime()
        Device.InefficientDevice()
        Device.ComparePowerUsage()