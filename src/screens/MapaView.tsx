import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { BUILDINGS, FLOORS, FLOOR_CROQUIS, RoomBlock } from '@/constants/campus-data';

interface MapaViewProps {
  darkMode?: boolean;
  initialBuilding?: 'Edificio A' | 'Edificio B' | 'Edificio C';
  initialFloor?: 'Piso 1' | 'Piso 2' | 'Piso 3';
  initialRoomCode?: string;
}

export default function MapaView({
  darkMode = false,
  initialBuilding = 'Edificio B',
  initialFloor = 'Piso 2',
  initialRoomCode = 'LAB-204',
}: MapaViewProps) {
  const [building, setBuilding] = useState<'Edificio A' | 'Edificio B' | 'Edificio C'>(
    initialBuilding
  );
  const [floor, setFloor] = useState<'Piso 1' | 'Piso 2' | 'Piso 3'>(initialFloor);
  const [selectedRoomCode, setSelectedRoomCode] = useState<string>(initialRoomCode);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenu, setOpenMenu] = useState<'building' | 'floor' | null>(null);

  const currentFloorRooms = FLOOR_CROQUIS[building][floor];
  const selectedRoom: RoomBlock =
    currentFloorRooms.find((r) => r.code === selectedRoomCode) ??
    currentFloorRooms[2] ??
    currentFloorRooms[0];

  // Búsqueda en todos los edificios y pisos cuando el usuario escribe
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    const trimmed = text.trim().toLowerCase();
    if (!trimmed) return;

    for (const b of BUILDINGS) {
      for (const f of FLOORS) {
        const match = FLOOR_CROQUIS[b][f].find(
          (room) =>
            room.code.toLowerCase().includes(trimmed) ||
            room.label.toLowerCase().includes(trimmed) ||
            room.professor.toLowerCase().includes(trimmed) ||
            room.subject.toLowerCase().includes(trimmed)
        );
        if (match) {
          setBuilding(b);
          setFloor(f);
          setSelectedRoomCode(match.code);
          return;
        }
      }
    }
  };

  const handleSelectBuilding = (b: 'Edificio A' | 'Edificio B' | 'Edificio C') => {
    setBuilding(b);
    const defaultRoom = FLOOR_CROQUIS[b][floor][2] ?? FLOOR_CROQUIS[b][floor][0];
    if (defaultRoom) setSelectedRoomCode(defaultRoom.code);
    setOpenMenu(null);
  };

  const handleSelectFloor = (f: 'Piso 1' | 'Piso 2' | 'Piso 3') => {
    setFloor(f);
    const defaultRoom = FLOOR_CROQUIS[building][f][2] ?? FLOOR_CROQUIS[building][f][0];
    if (defaultRoom) setSelectedRoomCode(defaultRoom.code);
    setOpenMenu(null);
  };

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* Encabezado y buscador */}
        <View style={[styles.topCard, darkMode && styles.topCardDark]}>
          <Text style={[styles.screenTitle, darkMode && styles.textDarkPrimary]}>
            Explorar Campus
          </Text>

          <View style={[styles.searchContainer, darkMode && styles.searchContainerDark]}>
            <Feather name="search" size={16} color="#6366f1" />
            <TextInput
              value={searchQuery}
              onChangeText={handleSearchChange}
              placeholder="Buscar profesor o salón..."
              placeholderTextColor="#94a3b8"
              style={[styles.searchInput, darkMode && styles.textDarkPrimary]}
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Feather name="x-circle" size={16} color="#94a3b8" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Selectores de Edificio y Piso */}
          <View style={styles.filtersRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setOpenMenu(openMenu === 'building' ? null : 'building')}
              style={[styles.buildingDropdown, darkMode && styles.buildingDropdownDark]}>
              <Text style={[styles.buildingDropdownText, darkMode && styles.textDarkPrimary]}>
                {building}
              </Text>
              <Feather
                name={openMenu === 'building' ? 'chevron-up' : 'chevron-down'}
                size={15}
                color={darkMode ? '#cbd5e1' : '#334155'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setOpenMenu(openMenu === 'floor' ? null : 'floor')}
              style={styles.floorDropdown}>
              <Text style={styles.floorDropdownText}>{floor}</Text>
              <Feather
                name={openMenu === 'floor' ? 'chevron-up' : 'chevron-down'}
                size={15}
                color="#4f46e5"
              />
            </TouchableOpacity>
          </View>

          {/* Menú desplegable interactivo cuando se pulsa Edificio o Piso */}
          {openMenu === 'building' ? (
            <View style={[styles.dropdownMenu, darkMode && styles.dropdownMenuDark]}>
              {BUILDINGS.map((b) => (
                <TouchableOpacity
                  key={b}
                  style={[
                    styles.dropdownOption,
                    b === building && styles.dropdownOptionActive,
                  ]}
                  onPress={() => handleSelectBuilding(b)}>
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      darkMode && styles.textDarkPrimary,
                      b === building && styles.dropdownOptionTextActive,
                    ]}>
                    {b}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          {openMenu === 'floor' ? (
            <View style={[styles.dropdownMenu, darkMode && styles.dropdownMenuDark]}>
              {FLOORS.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.dropdownOption, f === floor && styles.dropdownOptionActive]}
                  onPress={() => handleSelectFloor(f)}>
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      darkMode && styles.textDarkPrimary,
                      f === floor && styles.dropdownOptionTextActive,
                    ]}>
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>

        {/* Tarjeta del croquis de pasillo */}
        <View style={[styles.croquisCard, darkMode && styles.croquisCardDark]}>
          <View style={styles.blocksRow}>
            {currentFloorRooms.map((room) => {
              const isSelected = room.code === selectedRoom.code;
              return (
                <TouchableOpacity
                  key={room.code}
                  activeOpacity={0.85}
                  onPress={() => setSelectedRoomCode(room.code)}
                  style={[
                    styles.roomBlock,
                    darkMode && styles.roomBlockDark,
                    isSelected && styles.roomBlockSelected,
                  ]}>
                  {isSelected ? (
                    <>
                      <Ionicons name="location-outline" size={16} color="#052e16" />
                      <Text style={styles.selectedBlockCode}>{room.code}</Text>
                      <Text style={styles.selectedBlockFloor}>{room.floor}</Text>
                    </>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.croquisCaption}>
            Vista de croquis pasillo central ({building})
          </Text>
        </View>

        {/* Tarjeta verde de indicaciones de llegada */}
        <View style={styles.directionsCard}>
          <View style={styles.directionsHeaderRow}>
            <View style={styles.checkBadge}>
              <Feather name="check" size={13} color="#ffffff" />
            </View>
            <Text style={styles.directionsTitle}>Indicaciones de llegada</Text>
          </View>

          <Text style={styles.directionsBody}>{selectedRoom.directions}</Text>
        </View>

        {/* Mascota pixel-art del mapa tal como en reference.png */}
        <View style={styles.mascotContainer}>
          <Image
            source={require('../../assets/map_dog.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>
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
  scrollContent: {
    paddingBottom: 24,
  },
  topCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  topCardDark: {
    backgroundColor: '#1e293b',
    borderBottomColor: '#334155',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.4,
    marginBottom: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 42,
    marginBottom: 12,
  },
  searchContainerDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    marginLeft: 8,
    paddingVertical: 0,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
  },
  buildingDropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  buildingDropdownDark: {
    backgroundColor: '#0f172a',
    borderColor: '#475569',
  },
  buildingDropdownText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  floorDropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#eef2ff',
    borderWidth: 1.2,
    borderColor: '#6366f1',
  },
  floorDropdownText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4f46e5',
  },
  dropdownMenu: {
    marginTop: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  dropdownMenuDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  dropdownOptionActive: {
    backgroundColor: '#eef2ff',
  },
  dropdownOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  dropdownOptionTextActive: {
    color: '#4f46e5',
    fontWeight: '800',
  },
  croquisCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  croquisCardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  blocksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
    marginBottom: 14,
  },
  roomBlock: {
    flex: 1,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomBlockDark: {
    backgroundColor: '#334155',
  },
  roomBlockSelected: {
    flex: 1.35,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
    paddingHorizontal: 4,
  },
  selectedBlockCode: {
    fontSize: 11,
    fontWeight: '900',
    color: '#052e16',
    marginTop: 2,
  },
  selectedBlockFloor: {
    fontSize: 9,
    fontWeight: '700',
    color: '#064e3b',
  },
  croquisCaption: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    textAlign: 'center',
  },
  directionsCard: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#6ee7b7',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
  },
  directionsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  directionsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#064e3b',
  },
  directionsBody: {
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '500',
    color: '#065f46',
  },
  mascotContainer: {
    marginTop: 18,
    paddingHorizontal: 32,
    alignItems: 'flex-start',
  },
  mascotImage: {
    width: 135,
    height: 180,
  },
  textDarkPrimary: {
    color: '#f8fafc',
  },
});
