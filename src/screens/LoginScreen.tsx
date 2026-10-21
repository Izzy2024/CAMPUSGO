import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

// props que recibe la pantalla: funcion para pasar al home o el navigation
interface LoginScreenProps {
  onLogin?: (email: string) => void;
  navigation?: any;
}

export default function LoginScreen({ navigation, onLogin }: LoginScreenProps) {
  // guardamos lo que el usuario escribe en correo
  const [email, setEmail] = useState('');

  // guardamos la contraseña
  const [password, setPassword] = useState('');

  // para saber si mostramos u ocultamos la contraseña
  const [showPassword, setShowPassword] = useState(false);

  // funcion que se dispara al presionar el boton ingresar
  const handleLogin = () => {
    // validamos que no deje los campos vacios
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    // validamos que el correo tenga el arroba
    if (!email.includes('@')) {
      Alert.alert('Correo inválido', 'El correo debe tener un @');
      return;
    }

    // si todo salio bien, mandamos el correo y pasamos a la pantalla home
    if (onLogin) {
      onLogin(email);
    } else if (navigation?.navigate) {
      navigation.navigate('Home', { email });
    }
  };

  // boton secundario para entrar rapido con cuenta universitaria
  const handleSSOLogin = () => {
    const ssoEmail = 'estudiante.campus@universidad.edu';
    if (onLogin) {
      onLogin(ssoEmail);
    } else if (navigation?.navigate) {
      navigation.navigate('Home', { email: ssoEmail });
    }
  };

  return (
    // evita que la barra de arriba del celular tape las cosas
    <SafeAreaView style={styles.safeArea}>
      {/* sube la pantalla cuando sale el teclado */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        {/* permite hacer scroll para que no se corte en pantallas chicas */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          {/* logo y nombre de la app */}
          <View style={styles.brandHeader}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <Text style={styles.brandTitle}>Campus Go</Text>
          </View>

          {/* titulo y bienvenida */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>¡Hola, estudiante!</Text>
            <Text style={styles.subtitle}>
              Inicia sesión con tu correo institucional para acceder a tus mapas, horarios, salones
              y alertas de clase en tiempo real.
            </Text>
          </View>

          {/* formulario de login */}
          <View style={styles.formSection}>
            {/* input de correo con icono */}
            <Text style={styles.label}>CORREO INSTITUCIONAL</Text>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={18} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="ejemplo@miuniversidad.edu"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* input de contraseña con icono y boton para mostrar u ocultar */}
            <Text style={styles.label}>CONTRASEÑA</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={18} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              {/* cambia el ojito de ver o no la clave */}
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.togglePasswordText}>
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* link de recuperar contraseña */}
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() =>
                Alert.alert(
                  'Recuperar Contraseña',
                  'Se han enviado las instrucciones a tu correo institucional.'
                )
              }>
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {/* boton morado para iniciar sesion */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleLogin}
              activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            {/* linea de separacion */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>O ACCEDE CON</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* boton de entrar con sso institucional */}
            <TouchableOpacity
              style={styles.ssoButton}
              onPress={handleSSOLogin}
              activeOpacity={0.85}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#10b981" />
              <Text style={styles.ssoButtonText}>Single Sign-On (SSO) Universitario</Text>
            </TouchableOpacity>
          </View>

          {/* pie de pagina con mi nombre y correo de soporte */}
          <View style={styles.footerSection}>
            <Text style={styles.footerAuthor}>Hecho por Isaac Castillo</Text>
            <Text style={styles.footerSupport}>
              Soporte TI: <Text style={styles.footerSupportLink}>soporte@campusgo.edu</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// estilos de la pantalla
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  brandLogo: {
    width: 34,
    height: 34,
    borderRadius: 8,
    marginRight: 10,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  titleSection: {
    marginBottom: 26,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748b',
  },
  formSection: {
    width: '100%',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    height: '100%',
  },
  togglePasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f46e5',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f46e5',
  },
  primaryButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    marginHorizontal: 12,
    letterSpacing: 0.8,
  },
  ssoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    height: 50,
  },
  ssoButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 10,
  },
  footerSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerAuthor: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  footerSupport: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  footerSupportLink: {
    color: '#4f46e5',
    textDecorationLine: 'underline',
  },
});
