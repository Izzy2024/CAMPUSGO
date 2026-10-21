import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HorarioView from '@/screens/HorarioView';
import MapaView from '@/screens/MapaView';
import PerfilView from '@/screens/PerfilView';
import LockScreenModal from '@/screens/LockScreenModal';
import { ScheduleClass, WEEKLY_SCHEDULE } from '@/constants/campus-data';

interface HomeScreenProps {
  email?: string;
  route?: {
    params?: {
      email?: string;
    };
  };
  onLogout?: () => void;
}

export default function HomeScreen({ route, email: propEmail, onLogout }: HomeScreenProps) {
  const email = propEmail ?? route?.params?.email ?? 'estudiante@campusgo.edu';

  const [activeTab, setActiveTab] = useState<'Hoy' | 'Horario' | 'Mapa' | 'Perfil'>('Hoy');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [lockScreenVisible, setLockScreenVisible] = useState(false);

  // Estado de destino para cuando el usuario pulsa "¿Cómo llegar?" o una clase
  const [mapTarget, setMapTarget] = useState<{
    building: 'Edificio A' | 'Edificio B' | 'Edificio C';
    floor: 'Piso 1' | 'Piso 2' | 'Piso 3';
    roomCode: string;
  }>({
    building: 'Edificio B',
    floor: 'Piso 2',
    roomCode: 'LAB-204',
  });

  const navigateToRoomInMap = (
    building: 'Edificio A' | 'Edificio B' | 'Edificio C',
    floor: 'Piso 1' | 'Piso 2' | 'Piso 3',
    roomCode: string
  ) => {
    setMapTarget({ building, floor, roomCode });
    setActiveTab('Mapa');
  };

  const handleSelectScheduleClass = (item: ScheduleClass) => {
    navigateToRoomInMap(item.building, item.floor, item.roomCode);
  };

  // Clases para la vista "Hoy" (El resto del día)
  const upcomingClasses = WEEKLY_SCHEDULE.Lu.filter((c) => c.status === 'PRÓXIMA').filter(
    (c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.shortLocation.toLowerCase().includes(q) ||
        c.professor.toLowerCase().includes(q)
      );
    }
  );

  const currentClassMatchesSearch =
    !searchQuery.trim() ||
    'redes de computadoras'.includes(searchQuery.toLowerCase()) ||
    'lab-204'.includes(searchQuery.toLowerCase()) ||
    'alberto martínez'.includes(searchQuery.toLowerCase());

  return (
    <SafeAreaView style={[styles.safeArea, darkMode && styles.safeAreaDark]}>
      <View style={[styles.container, darkMode && styles.containerDark]}>
        {/* Contenido según la pestaña activa */}
        {activeTab === 'Hoy' ? (
          <>
            {/* Barra superior con logo y buscador */}
            <View style={[styles.header, darkMode && styles.headerDark]}>
              <View style={styles.brandRow}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={[styles.brandTitle, darkMode && styles.textDarkPrimary]}>
                  Campus Go
                </Text>
              </View>

              <View style={[styles.searchBar, darkMode && styles.searchBarDark]}>
                <Feather name="search" size={15} color="#6366f1" />
                <TextInput
                  placeholder="Buscar..."
                  placeholderTextColor="#94a3b8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={[styles.searchInput, darkMode && styles.textDarkPrimary]}
                />
              </View>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}>
              {/* Banner amarillo de próxima clase (al tocarlo muestra la notificación en Lock Screen) */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setLockScreenVisible(true)}
                style={styles.alertBanner}>
                <Feather name="clock" size={17} color="#d97706" />
                <Text style={styles.alertBannerText}>
                  Próxima clase en <Text style={styles.alertBannerHighlight}>12 min</Text>
                </Text>
              </TouchableOpacity>

              {/* Tarjeta principal de la clase actual o siguiente */}
              {currentClassMatchesSearch ? (
                <View style={[styles.classCard, darkMode && styles.classCardDark]}>
                  <Text style={styles.cardEyebrow}>CLASE ACTUAL O SIGUIENTE</Text>
                  <Text style={[styles.cardTitle, darkMode && styles.textDarkPrimary]}>
                    Redes de Computadoras
                  </Text>

                  <View style={styles.metaRow}>
                    <View style={[styles.iconCircle, { backgroundColor: '#ecfdf5' }]}>
                      <Ionicons name="location-outline" size={17} color="#059669" />
                    </View>
                    <Text style={[styles.metaText, darkMode && styles.textDarkSecondary]}>
                      Piso 2 — Salón LAB-204
                    </Text>
                  </View>

                  <View style={styles.metaRow}>
                    <View style={[styles.iconCircle, { backgroundColor: '#eef2ff' }]}>
                      <Feather name="user" size={15} color="#6366f1" />
                    </View>
                    <Text style={[styles.metaText, darkMode && styles.textDarkSecondary]}>
                      Ing. Alberto Martínez
                    </Text>
                  </View>

                  <View style={styles.metaRow}>
                    <View style={[styles.iconCircle, { backgroundColor: '#eef2ff' }]}>
                      <Feather name="clock" size={15} color="#6366f1" />
                    </View>
                    <Text style={[styles.metaText, darkMode && styles.textDarkSecondary]}>
                      14:00 - 16:00 hrs
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.navigateButton}
                    activeOpacity={0.85}
                    onPress={() => navigateToRoomInMap('Edificio B', 'Piso 2', 'LAB-204')}>
                    <Ionicons
                      name="navigate-outline"
                      size={17}
                      color="#ffffff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.navigateButtonText}>¿Cómo llegar?</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {/* Lista de clases para el resto del día */}
              <Text style={[styles.sectionTitle, darkMode && styles.textDarkPrimary]}>
                El resto del día
              </Text>

              {upcomingClasses.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  onPress={() => handleSelectScheduleClass(item)}
                  style={[styles.scheduleItem, darkMode && styles.scheduleItemDark]}>
                  <View style={styles.timeBadge}>
                    <Text style={styles.timeBadgeText}>{item.startTime}</Text>
                  </View>
                  <View style={styles.scheduleInfo}>
                    <Text style={[styles.scheduleTitle, darkMode && styles.textDarkPrimary]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.scheduleSubtitle, darkMode && styles.textDarkSecondary]}>
                      {item.shortLocation}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        ) : null}

        {activeTab === 'Horario' ? (
          <HorarioView
            darkMode={darkMode}
            onSelectClassForMap={handleSelectScheduleClass}
          />
        ) : null}

        {activeTab === 'Mapa' ? (
          <MapaView
            key={`${mapTarget.building}-${mapTarget.floor}-${mapTarget.roomCode}`}
            darkMode={darkMode}
            initialBuilding={mapTarget.building}
            initialFloor={mapTarget.floor}
            initialRoomCode={mapTarget.roomCode}
          />
        ) : null}

        {activeTab === 'Perfil' ? (
          <PerfilView
            email={email}
            darkMode={darkMode}
            onToggleDarkMode={setDarkMode}
            onOpenLockScreen={() => setLockScreenVisible(true)}
            onLogout={onLogout}
          />
        ) : null}

        {/* Barra de pestañas inferior */}
        <View style={[styles.bottomTabBar, darkMode && styles.bottomTabBarDark]}>
          <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Hoy')}>
            <View
              style={[
                styles.tabIconWrapper,
                activeTab === 'Hoy' && styles.tabIconActiveWrapper,
              ]}>
              <MaterialCommunityIcons
                name="calendar-today"
                size={21}
                color={activeTab === 'Hoy' ? '#4f46e5' : '#94a3b8'}
              />
            </View>
            <Text style={[styles.tabLabel, activeTab === 'Hoy' && styles.tabLabelActive]}>
              Hoy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Horario')}>
            <View
              style={[
                styles.tabIconWrapper,
                activeTab === 'Horario' && styles.tabIconActiveWrapper,
              ]}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={21}
                color={activeTab === 'Horario' ? '#4f46e5' : '#94a3b8'}
              />
            </View>
            <Text style={[styles.tabLabel, activeTab === 'Horario' && styles.tabLabelActive]}>
              Horario
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Mapa')}>
            <View
              style={[
                styles.tabIconWrapper,
                activeTab === 'Mapa' && styles.tabIconActiveWrapper,
              ]}>
              <Feather
                name="map"
                size={19}
                color={activeTab === 'Mapa' ? '#4f46e5' : '#94a3b8'}
              />
            </View>
            <Text style={[styles.tabLabel, activeTab === 'Mapa' && styles.tabLabelActive]}>
              Mapa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Perfil')}>
            <View
              style={[
                styles.tabIconWrapper,
                activeTab === 'Perfil' && styles.tabIconActiveWrapper,
              ]}>
              <Feather
                name="user"
                size={19}
                color={activeTab === 'Perfil' ? '#4f46e5' : '#94a3b8'}
              />
            </View>
            <Text style={[styles.tabLabel, activeTab === 'Perfil' && styles.tabLabelActive]}>
              Perfil
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal de Pantalla de Bloqueo (campus-go-lock-screen) */}
        <LockScreenModal
          visible={lockScreenVisible}
          onUnlock={() => setLockScreenVisible(false)}
          onNavigateToClass={() => {
            setLockScreenVisible(false);
            navigateToRoomInMap('Edificio B', 'Piso 2', 'LAB-204');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeAreaDark: {
    backgroundColor: '#1e293b',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerDark: {
    backgroundColor: '#1e293b',
    borderBottomColor: '#334155',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 8,
    marginRight: 8,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 34,
    width: 112,
  },
  searchBarDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0f172a',
    marginLeft: 6,
    paddingVertical: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  alertBannerText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#78350f',
    marginLeft: 10,
  },
  alertBannerHighlight: {
    fontWeight: '800',
    color: '#d97706',
  },
  classCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  classCardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  cardEyebrow: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
  },
  navigateButton: {
    flexDirection: 'row',
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  navigateButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  scheduleItemDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  timeBadge: {
    backgroundColor: '#eef2ff',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 11,
    marginRight: 14,
  },
  timeBadgeText: {
    color: '#4f46e5',
    fontSize: 12.5,
    fontWeight: '800',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  scheduleSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    paddingBottom: 14,
    justifyContent: 'space-around',
  },
  bottomTabBarDark: {
    backgroundColor: '#1e293b',
    borderTopColor: '#334155',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIconWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tabIconActiveWrapper: {
    backgroundColor: '#eef2ff',
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#4f46e5',
    fontWeight: '800',
  },
  textDarkPrimary: {
    color: '#f8fafc',
  },
  textDarkSecondary: {
    color: '#94a3b8',
  },
});
