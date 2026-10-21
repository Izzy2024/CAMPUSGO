import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

interface PerfilViewProps {
  email: string;
  darkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
  onOpenLockScreen: () => void;
  onLogout?: () => void;
}

export default function PerfilView({
  email,
  darkMode,
  onToggleDarkMode,
  onOpenLockScreen,
  onLogout,
}: PerfilViewProps) {
  const [classAlerts, setClassAlerts] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'Al día' | 'Sincronizando...'>('Al día');

  const handleSyncSchedule = () => {
    setSyncStatus('Sincronizando...');
    setTimeout(() => {
      setSyncStatus('Al día');
      Alert.alert('Horario sincronizado', 'Tu horario institucional está actualizado al día.');
    }, 600);
  };

  return (
    <ScrollView
      style={[styles.container, darkMode && styles.containerDark]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Cabecera con avatar y datos del estudiante */}
      <View style={[styles.profileHeader, darkMode && styles.profileHeaderDark]}>
        <Image
          source={require('../../assets/profile_avatar.png')}
          style={styles.avatar}
          resizeMode="cover"
        />
        <Text style={[styles.studentName, darkMode && styles.textDarkPrimary]}>
          Carlos Fuentes Díaz
        </Text>
        <Text style={[styles.studentMeta, darkMode && styles.textDarkSecondary]}>
          Ingeniería de Software • ID: 20261048
        </Text>
      </View>

      {/* Sección Ajustes & Preferencias */}
      <View style={styles.settingsSection}>
        <Text style={[styles.sectionTitle, darkMode && styles.textDarkPrimary]}>
          Ajustes & Preferencias
        </Text>

        {/* Alertas de clase */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setClassAlerts(!classAlerts)}
          style={[styles.settingRow, darkMode && styles.settingRowDark]}>
          <View style={styles.settingLeft}>
            <Feather
              name="bell"
              size={17}
              color={darkMode ? '#cbd5e1' : '#334155'}
              style={styles.settingIcon}
            />
            <Text style={[styles.settingLabel, darkMode && styles.textDarkPrimary]}>
              Alertas de clase
            </Text>
          </View>

          <View style={[styles.toggleTrack, classAlerts && styles.toggleTrackActive]}>
            <View style={[styles.toggleThumb, classAlerts && styles.toggleThumbActive]} />
          </View>
        </TouchableOpacity>

        {/* Modo oscuro */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onToggleDarkMode(!darkMode)}
          style={[styles.settingRow, darkMode && styles.settingRowDark]}>
          <View style={styles.settingLeft}>
            <Feather
              name="moon"
              size={17}
              color={darkMode ? '#cbd5e1' : '#334155'}
              style={styles.settingIcon}
            />
            <Text style={[styles.settingLabel, darkMode && styles.textDarkPrimary]}>
              Modo oscuro
            </Text>
          </View>

          <View style={[styles.toggleTrack, darkMode && styles.toggleTrackActive]}>
            <View style={[styles.toggleThumb, darkMode && styles.toggleThumbActive]} />
          </View>
        </TouchableOpacity>

        {/* Sincronizar horario */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSyncSchedule}
          style={[styles.settingRow, darkMode && styles.settingRowDark]}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons
              name="calendar-sync-outline"
              size={18}
              color={darkMode ? '#cbd5e1' : '#334155'}
              style={styles.settingIcon}
            />
            <Text style={[styles.settingLabel, darkMode && styles.textDarkPrimary]}>
              Sincronizar horario
            </Text>
          </View>

          <Text style={styles.syncStatusText}>{syncStatus}</Text>
        </TouchableOpacity>

        {/* Versión de la aplicación */}
        <View
          style={[
            styles.settingRow,
            styles.versionRow,
            darkMode && styles.settingRowDark,
          ]}>
          <Text style={[styles.versionLabel, darkMode && styles.textDarkSecondary]}>
            Versión de la aplicación
          </Text>
          <Text style={styles.versionNumber}>v2.4.1</Text>
        </View>

        {/* Acciones de demostración: Pantalla de bloqueo y Cerrar sesión */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onOpenLockScreen}
          style={[styles.lockScreenButton, darkMode && styles.settingRowDark]}>
          <Feather name="smartphone" size={16} color="#4f46e5" style={{ marginRight: 8 }} />
          <Text style={styles.lockScreenButtonText}>
            Ver notificación en Pantalla de Bloqueo
          </Text>
        </TouchableOpacity>

        {onLogout ? (
          <View style={styles.logoutSection}>
            <Text style={styles.loggedEmailText}>Sesión activa: {email}</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onLogout}
              style={styles.logoutButton}>
              <Feather name="log-out" size={15} color="#ef4444" style={{ marginRight: 6 }} />
              <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </ScrollView>
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
  scrollContent: {
    paddingBottom: 28,
  },
  profileHeader: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  profileHeaderDark: {
    backgroundColor: '#1e293b',
    borderBottomColor: '#334155',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginBottom: 12,
  },
  studentName: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  studentMeta: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  settingsSection: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  settingRowDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1e293b',
  },
  toggleTrack: {
    width: 40,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#cbd5e1',
    padding: 2,
    justifyContent: 'center',
  },
  toggleTrackActive: {
    backgroundColor: '#4f46e5',
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  syncStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
  },
  versionRow: {
    marginTop: 10,
  },
  versionLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748b',
  },
  versionNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  lockScreenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    height: 44,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  lockScreenButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4f46e5',
  },
  logoutSection: {
    marginTop: 22,
    alignItems: 'center',
  },
  loggedEmailText: {
    fontSize: 11.5,
    color: '#94a3b8',
    marginBottom: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
  },
  logoutButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ef4444',
  },
  textDarkPrimary: {
    color: '#f8fafc',
  },
  textDarkSecondary: {
    color: '#94a3b8',
  },
});
