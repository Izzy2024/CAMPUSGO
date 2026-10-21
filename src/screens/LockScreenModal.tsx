import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  SafeAreaView,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

interface LockScreenModalProps {
  visible: boolean;
  onUnlock: () => void;
  onNavigateToClass: () => void;
}

export default function LockScreenModal({
  visible,
  onUnlock,
  onNavigateToClass,
}: LockScreenModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onUnlock}>
      <View style={styles.wallpaperContainer}>
        {/* Simulación del fondo desenfocado/atenuado de la app */}
        <View style={styles.backgroundGhostLayer} pointerEvents="none">
          <View style={styles.ghostSearchPill}>
            <Feather name="search" size={14} color="#64748b" />
            <Text style={styles.ghostSearchText}>Buscar profesor o salón...</Text>
          </View>
          <View style={styles.ghostBanner}>
            <Text style={styles.ghostBannerText}>⚠️ Próxima clase en 12 min</Text>
          </View>
          <View style={styles.ghostBottomBlock}>
            <Text style={styles.ghostBottomText}>
              18:00 - 20:00 — Bases de Datos —{'\n'}Piso 3, Salón 305
            </Text>
          </View>
        </View>

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.lockContent}>
            {/* Isla dinámica decorativa y reloj de bloqueo */}
            <View style={styles.topClockArea}>
              <View style={styles.dynamicIsland} />
              <Text style={styles.lockDate}>LUNES, 10 DE SEPTIEMBRE</Text>
              <Text style={styles.lockTime}>13:48</Text>
            </View>

            {/* Notificaciones apiladas */}
            <View style={styles.notificationsStack}>
              {/* Notificación principal interactiva */}
              <View style={styles.primaryNotificationCard}>
                <View style={styles.notifHeaderRow}>
                  <View style={styles.notifAppBrand}>
                    <Image
                      source={require('../../assets/logo.png')}
                      style={styles.notifLogo}
                      resizeMode="contain"
                    />
                    <Text style={styles.notifAppName}>CAMPUS GO</Text>
                  </View>
                  <Text style={styles.notifTimestamp}>ahora mismo</Text>
                </View>

                <View style={styles.notifAlertPill}>
                  <Feather name="clock" size={14} color="#d97706" />
                  <Text style={styles.notifAlertText}>
                    Próxima clase en <Text style={styles.notifAlertHighlight}>12 min</Text>
                  </Text>
                </View>

                <Text style={styles.notifClassTitle}>Redes de Computadoras</Text>

                <View style={styles.notifMetaRow}>
                  <View style={[styles.notifMetaDot, { backgroundColor: '#dcfce7' }]}>
                    <Ionicons name="location-outline" size={13} color="#15803d" />
                  </View>
                  <Text style={styles.notifMetaText}>Piso 2 — Salón LAB-204</Text>
                </View>

                <View style={styles.notifMetaRow}>
                  <View style={[styles.notifMetaDot, { backgroundColor: '#eef2ff' }]}>
                    <Feather name="clock" size={12} color="#4f46e5" />
                  </View>
                  <Text style={styles.notifMetaText}>14:00 - 16:00 hrs</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={onNavigateToClass}
                  style={styles.notifActionButton}>
                  <Ionicons
                    name="navigate-outline"
                    size={16}
                    color="#ffffff"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.notifActionButtonText}>¿Cómo llegar?</Text>
                </TouchableOpacity>
              </View>

              {/* Segunda notificación (hace 15 min) */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={onUnlock}
                style={styles.secondaryNotificationCard}>
                <View style={styles.secondaryHeaderRow}>
                  <Text style={styles.secondaryAppName}>CAMPUS GO</Text>
                  <Text style={styles.secondaryTimestamp}>hace 15 min</Text>
                </View>

                <View style={styles.secondaryBodyRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.secondaryTitle}>Programación Avanzada</Text>
                    <Text style={styles.secondarySubtitle}>Edificio B, LAB-110</Text>
                  </View>
                  <Text style={styles.secondaryTime}>16:00</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Controles inferiores de pantalla de bloqueo */}
            <View style={styles.bottomControlsArea}>
              <View style={styles.shortcutButtonsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onUnlock}
                  style={styles.circleShortcutButton}>
                  <Ionicons name="flashlight-outline" size={20} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onUnlock}
                  style={styles.circleShortcutButton}>
                  <Ionicons name="camera-outline" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onUnlock}
                style={styles.unlockSwipeArea}>
                <Text style={styles.unlockHintText}>
                  Desliza hacia arriba para desbloquear
                </Text>
                <View style={styles.homeIndicatorBar} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wallpaperContainer: {
    flex: 1,
    backgroundColor: '#475569',
  },
  backgroundGhostLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    paddingHorizontal: 22,
    paddingTop: 72,
    justifyContent: 'space-between',
    paddingBottom: 90,
    opacity: 0.35,
  },
  ghostSearchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
    gap: 8,
  },
  ghostSearchText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  ghostBanner: {
    backgroundColor: '#fde68a',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginTop: -120,
  },
  ghostBannerText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#78350f',
  },
  ghostBottomBlock: {
    backgroundColor: '#cbd5e1',
    borderRadius: 16,
    padding: 16,
  },
  ghostBottomText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 19,
  },
  safeArea: {
    flex: 1,
  },
  lockContent: {
    flex: 1,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
  },
  topClockArea: {
    alignItems: 'center',
    paddingTop: 8,
  },
  dynamicIsland: {
    width: 86,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#020617',
    marginBottom: 14,
  },
  lockDate: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#f1f5f9',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  lockTime: {
    fontSize: 58,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1.5,
    lineHeight: 64,
  },
  notificationsStack: {
    gap: 12,
  },
  primaryNotificationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 22,
    padding: 16,
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  notifHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  notifAppBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notifLogo: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  notifAppName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: 0.4,
  },
  notifTimestamp: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  notifAlertPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  notifAlertText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400e',
    marginLeft: 8,
  },
  notifAlertHighlight: {
    fontWeight: '900',
    color: '#d97706',
  },
  notifClassTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 8,
  },
  notifMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  notifMetaDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  notifMetaText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },
  notifActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    height: 42,
    marginTop: 8,
  },
  notifActionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryNotificationCard: {
    backgroundColor: 'rgba(241, 245, 249, 0.85)',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  secondaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  secondaryAppName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.4,
  },
  secondaryTimestamp: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748b',
  },
  secondaryBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secondaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  secondarySubtitle: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#475569',
  },
  secondaryTime: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  bottomControlsArea: {
    paddingBottom: 8,
  },
  shortcutButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  circleShortcutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  unlockSwipeArea: {
    alignItems: 'center',
  },
  unlockHintText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 10,
  },
  homeIndicatorBar: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
});
