import urllib2
import datetime
import json
import csv
import sys
import logging


"""
	Global logger
"""
logging.basicConfig(format = "%(asctime)-15s %(message)s")
logger = logging.getLogger('datatool')


class DataLoader(object):
	"""
		Contains methods to access data from URL, CSV, etc.
	"""
	@staticmethod
	def loadFromUrl(url):
		response = urllib2.urlopen(url)
		data = json.load(response)
		return data

	@staticmethod
	def loadFromJsonFile(uri):
		handler = open(uri)
		data = json.load(handler)
		return data

	@staticmethod
	def loadFromCsvFile(uri, header = False):
		reader = csv.reader(open(uri), delimiter = ",")
		data = []
		if header == True:
			next(reader, None)
		for row in reader:
			data.append(row)
		return data

	@staticmethod
	def filterByMonth(data, category, month):
		subdata = []
		for d in data:
			try:
				ts = datetime.datetime.strptime(d[category][:-6], '%m/%d/%Y %H:%M:%S %p')
				if ts.month == month:
					subdata.append(d)
			except:
				logger.error("datetime format issue")
		return subdata

	@staticmethod
	def filterByType(data, category, type):
		subdata = []
		for d in data:
			if d[category] == type:
				subdata.append(d)
		return subdata



class DataAnalyzer(object):
	"""
		Analyze the data (JSON) in various strategies.
	"""
	@staticmethod
	def analyzeCategoryFrequency(data, category):
		result = {}
		for d in data:
			if d[category] not in result.keys():
				result[d[category]] = 0
			result[d[category]] += 1
		result = sorted(result, key=result.get)
		return result

	@staticmethod
	def analyzeTimeIntervalHistogram(data, category, top = 30, unit = 60, percentage = True):
		sequence = []
		for d in data:
			try:
				ts = datetime.datetime.strptime(d[category][:-6], '%m/%d/%Y %H:%M:%S %p')
				sequence.append(ts)
			except:
				logger.error("datetime format issue")
		sequence = sorted(sequence)
		intervals = []
		for index in range(1, len(sequence)):
			diff = (sequence[index] - sequence[index-1]).seconds
			intervals.append(diff)

		hist = [0 for o in range(top + 1)]
		for interval in intervals:
			index = interval / unit
			if index > top:
				continue
			hist[index] += 1
		if percentage == True:
			hist = [o * 100.0/len(sequence) for o in hist]
		return hist

	@staticmethod
	def analyzeTimeOfDayHistogram(data, category, percentage = True):
		hist = [0 for o in range(24)] # 24 hours a day.
		for d in data:
			try:
				ts = datetime.datetime.strptime(d[category][:-6], '%m/%d/%Y %H:%M:%S %p')
				hist[ts.hour] += 1
			except:
				logger.error(sys.exc_info()[0])

		if percentage == True:
			total = sum(hist) + 0.1 # avoid division by zero
			hist = [o * 100.0/total for o in hist]
		return hist

	@staticmethod
	def analyzeTimeOfDayIntervalHistogram(data, category, top = 30, unit = 60, percentage = True):
		hist = [[0 for v in range(top + 1)] for o in range(24)]
		sequence = []
		for d in data:
			try:
				ts = datetime.datetime.strptime(d[category][:-6], '%m/%d/%Y %H:%M:%S %p')
				sequence.append(ts)
			except:
				logger.error(sys.exc_info()[0])

		sequence = sorted(sequence)
		for index in range(1, len(sequence)):
			interval = (sequence[index] - sequence[index-1]).seconds / unit
			hour = sequence[index].hour
			if interval > top:
				continue
			hist[hour][interval] += 1
		if percentage == True:
			for index in range(len(hist)):
				if sum(hist[index]) == 0:
					continue
				hist[index] = [o * 100.0 / sum(hist[index])]
		return hist


	@staticmethod
	def getYearSpan(data, category):
		start = datetime.date.max
		stop = datetime.date.min
		for d in data:
			if d[category] < start:
				start = d[category]
			if d[category] > stop:
				stop = d[category]
		return (stop - start).days / 365 + 1

	@staticmethod
	def getMonthSpan(data, category):
		start = datetime.date.max
		stop = datetime.date.min
		for d in data:
			if d[category] < start:
				start = d[category]
			if d[category] > stop:
				stop = d[category]
		return (stop - start).days / 30 + 1

	@staticmethod
	def getDaySpan(data, category):
		start = datetime.date.max
		stop = datetime.date.min
		for d in data:
			if d[category] < start:
				start = d[category]
			if d[category] > stop:
				stop = d[category]
		return (stop - start).days


if __name__ == '__main__':
	data = DataLoader.loadFromCsvFile("C:\\Users\\jilli\\Desktop\\incidentscsv.csv")

	#for type in ['Aid Response', 'Medic Response', 'Auto Fire Alarm', 'Trans to AMR', 'Motor Vehicle Accident', 'Aid Response Yellow']:
	#	subdata = DataLoader.filterByType(data, 1, type);
	#	result = DataAnalyzer.analyzeTimeIntervalHistogram(subdata, 2, top=15);
	#	result = ["%.2f" % o for o in result]
	#	print type, result
	
	#for month in range(1, 13):
	#	subdata = DataLoader.filterByMonth(data, 2, month);
	#	result = DataAnalyzer.analyzeTimeOfDayHistogram(subdata, 2)
	#	result = ["%.2f" % o for o in result]
	#	print month, result

	#result = DataAnalyzer.analyzeTimeOfDayIntervalHistogram(data, 2, top = 15, percentage = False)
	#for r in result:
	#	print ["%.2f" % o for o in r]

	result = DataAnalyzer.analyzeCategoryFrequency(data, 2)
	for key in result.keys():
		print key, result[key]