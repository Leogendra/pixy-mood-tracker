import { Platform, View } from 'react-native';
import useColors from '../hooks/useColors';
import { SettingsScreen, StatisticsScreen } from '../screens';
import LinkButton from '../components/LinkButton';
import { useCalendarFilters } from '../hooks/useCalendarFilters';
import CalendarScreen from '../screens/Calendar';
import { MyTabBar } from "./MyTabBar";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { t } from '../helpers/translation';

const Tab = createBottomTabNavigator();

export const BottomTabs = () => {
  const colors = useColors();
  const calendarFilters = useCalendarFilters();

  const defaultOptions = {
    headerTintColor: colors.text,
    headerStyle: {
      backgroundColor: colors.background,
      shadowColor: 'transparent',
      borderBottomWidth: 1,
      borderBottomColor: colors.headerBorder,
    },
    headerShadowVisible: Platform.OS !== 'web',
    tabBarStyle: {
      borderTopColor: colors.headerBorder,
    },
  };

  return (
    <Tab.Navigator
      initialRouteName="Calendar"
      screenOptions={({ route }) => ({
        headerStyle: {
          borderBottomColor: '#fff',
        },
      })}
      tabBar={props => <MyTabBar {...props} />}
    >
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={({ navigation }) => ({
          ...defaultOptions,
          headerShown: false,
          tabBarTestID: 'statistics',
          title: t('statistics'),
        })} />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={({ navigation }) => ({
          ...defaultOptions,
          headerRight: () => (
            <View style={{ paddingRight: 16 }}>
              <LinkButton
                onPress={() => {
                  if (calendarFilters.isOpen) {
                    calendarFilters.close();
                  } else {
                    calendarFilters.open();
                  }
                }}
                testID="filters"
                type='primary'
              >{t('calendar_filters')} {calendarFilters.data.isFiltering ? `(${calendarFilters.data.filterCount})` : ''}</LinkButton>
            </View>
          ),
          tabBarTestID: 'calendar',
          title: t('calendar'),
        })} />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation }) => ({
          ...defaultOptions,
          headerShown: false,
          tabBarTestID: 'settings',
          title: t('settings'),
        })} />
    </Tab.Navigator>
  );
};
