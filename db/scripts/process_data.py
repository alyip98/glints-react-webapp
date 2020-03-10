import csv
import re


def process(days, time, open_hours):
    # print(days, time)
    [start_time, end_time] = time.split(' - ')
    start_time, end_time = time_index(start_time), time_index(end_time)
    open_overnight = end_time < start_time
    for day in days.split(","):
        if day.find("-") >= 0:
            [start_day, end_day] = day.split("-")
            start_index = day_index(start_day)
            end_index = day_index(end_day)
            if end_index < start_index:
                end_index += 7
            days_indices = [d % 7 for d in range(start_index, end_index + 1)]
        else:
            days_indices = [day_index(day)]

        # print(day, days_indices)
        for index in days_indices:
            if not open_overnight:
                open_hours[index].append([start_time, end_time])
            else: # start time is today, end time is tomorrow
                tomorrow_index = (index + 1) % 7
                open_hours[index].append([start_time, 1440])
                open_hours[tomorrow_index].append([0, end_time])

    return open_hours


def time_index(time):
    [hhmm, meridiem] = time.split(" ")
    if hhmm.find(':') >= 0:
        [hh, mm] = hhmm.split(':')
    else:
        hh, mm = hhmm.split(' ')[0], 0
    hh, mm = int(hh), int(mm)
    is_pm = meridiem == "pm"
    return (hh % 12) * 60 + mm + is_pm * 60 * 12


def day_index(day):
    day = day.strip()
    if day in DAYS:
        return DAYS.index(day)
    else:
        for i in range(len(DAYS)):
            if day.find(DAYS[i]) != -1:
                return i
    raise Exception(day)


DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
pattern = re.compile("(?:((?:[a-zA-Z]+(?:-[a-zA-Z]+)?(?:, )?)*) (\d+(?::\d+)? [a|p]m - \d+(?::\d+)? [a|p]m))*")


def process_row(row):
    [restaurant_name, raw_opening_hours] = row
    print(restaurant_name)

    matches = pattern.finditer(raw_opening_hours)
    opening = [[] for _ in range(7)]
    for i in matches:
        if i[0] != '':
            process(i.group(1), i.group(2), opening)
            # print(i.group(1, 2))

    # for i in range(len(opening)):
        # print(DAYS[i], opening[i])

    print('\n')
    return restaurant_name, opening


if __name__ == '__main__':
    with open('../seed/raw-hours.csv', encoding="utf8") as file:
        reader = csv.reader(file)
        data = []
        header = next(reader) # Skip header
        print(header)
        for row in reader:
            data.append(row)

    with open('../seed/processed-hours.csv', mode='w', newline='') as file:
        writer = csv.writer(file)
        columns = ["Restaurant"] + DAYS
        writer.writerow(columns)
        for row in data:
            restaurant_name, opening_hours = process_row(row)
            writer.writerow([restaurant_name] + opening_hours)
