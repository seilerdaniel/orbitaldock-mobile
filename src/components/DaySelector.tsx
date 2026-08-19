import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { WeekDay, WEEK_DAYS } from '@/src/types';

interface DaySelectorProps {
  selected: WeekDay;
  onSelect: (day: WeekDay) => void;
}

export function DaySelector({ selected, onSelect }: DaySelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-1 py-1"
    >
      {WEEK_DAYS.map((day) => {
        const isSelected = day === selected;
        return (
          <TouchableOpacity
            key={day}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelect(day)}
            className={`items-center justify-center rounded-xl border px-4 py-2.5 ${
              isSelected
                ? 'border-indigo-400 bg-indigo-500'
                : 'border-slate-700/50 bg-slate-800'
            }`}
          >
            <Text className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
              {day}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}