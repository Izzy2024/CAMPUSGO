import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { DAYS, DayKey, ScheduleClass, WEEKLY_SCHEDULE } from '@/constants/campus-data';

interface HorarioViewProps {
  darkMode?: boolean;
  onSelectClassForMap?: (item: ScheduleClass) => void;
}

export default function HorarioView({ darkMode = false, onSelectClassForMap }: HorarioViewProps) {
  const [selectedDay, setSelectedDay] = useState<DayKey>('Lu');
  const classes = WEEKLY_SCHEDULE[selectedDay] ?? [];

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      {/* Encabezado y selector de días */}
      <View style={[styles.headerSection, darkMode && styles.headerSectionDark]}>
        <Text style={[styles.screenTitle, darkMode && styles.textDarkPrimary]}>
          Horario Semanal
        </Text>

        <View style={styles.daysRow}>
          {DAYS.map((day) => {
            const isSelected = day.key === selectedDay;
            return (
              <TouchableOpacity
                key={day.key}
                activeOpacity={0.8}
                onPress={() => setSelectedDay(day.key)}
                style={[
                  styles.dayPill,
                  darkMode && styles.dayPillDark,
                  isSelected && styles.dayPillActive,
                ]}>
                <Text
                  style={[
                    styles.dayPillText,
                    darkMode && styles.dayPillTextDark,
                    isSelected && styles.dayPillTextActive,
                  ]}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Lista de clases del día */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {classes.map((item) => {
          const isCompleted = item.status === 'COMPLETADA';
          const isCurrent = item.status === 'CLASE ACTUAL';
          const isUpcoming = item.status === 'PRÓXIMA';

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => onSelectClassForMap?.(item)}
              style={[
                styles.card,
                darkMode && styles.cardDark,
                isCompleted && styles.cardCompleted,
                isCurrent && styles.cardCurrent,
              ]}>
              {isUpcoming ? <View style={styles.upcomingAccentBar} /> : null}

              <View style={[styles.cardInner, isUpcoming && styles.cardInnerWithAccent]}>
                <View style={styles.cardTopRow}>
                  <Text
                    style={[
                      styles.timeText,
                      darkMode && styles.textDarkSecondary,
                      isCurrent && styles.timeTextCurrent,
                    ]}>
                    {item.timeRange}
                  </Text>

                  <View
                    style={[
                      styles.statusBadge,
                      isCompleted && styles.badgeCompleted,
                      isCurrent && styles.badgeCurrent,
                      isUpcoming && styles.badgeUpcoming,
                    ]}>
                    <Text
                      style={[
                        styles.statusBadgeText,
                        isCompleted && styles.badgeCompletedText,
                        isCurrent && styles.badgeCurrentText,
                        isUpcoming && styles.badgeUpcomingText,
                      ]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.subjectTitle,
                    darkMode && styles.textDarkPrimary,
                    isCompleted && styles.subjectTitleCompleted,
                  ]}>
                  {item.title}
                </Text>
                <Text style={[styles.locationText, darkMode && styles.textDarkSecondary]}>
                  {item.locationLabel}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#0f172a',
  },
  headerSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerSectionDark: {
    backgroundColor: '#1e293b',
    borderBottomColor: '#334155',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.4,
    marginBottom: 16,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dayPill: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillDark: {
    backgroundColor: '#334155',
  },
  dayPillActive: {
    backgroundColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 3,
  },
  dayPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  dayPillTextDark: {
    color: '#cbd5e1',
  },
  dayPillTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  cardCompleted: {
    opacity: 0.56,
    backgroundColor: '#f8fafc',
  },
  cardCurrent: {
    borderWidth: 2,
    borderColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  upcomingAccentBar: {
    width: 4,
    marginVertical: 12,
    marginLeft: 10,
    borderRadius: 2,
    backgroundColor: '#f59e0b',
  },
  cardInner: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  cardInnerWithAccent: {
    paddingLeft: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  timeTextCurrent: {
    color: '#4f46e5',
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeCompleted: {
    backgroundColor: '#e2e8f0',
  },
  badgeCurrent: {
    backgroundColor: '#eef2ff',
  },
  badgeUpcoming: {
    backgroundColor: '#fef3c7',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  badgeCompletedText: {
    color: '#64748b',
  },
  badgeCurrentText: {
    color: '#4f46e5',
  },
  badgeUpcomingText: {
    color: '#d97706',
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  subjectTitleCompleted: {
    color: '#334155',
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  textDarkPrimary: {
    color: '#f8fafc',
  },
  textDarkSecondary: {
    color: '#94a3b8',
  },
});
