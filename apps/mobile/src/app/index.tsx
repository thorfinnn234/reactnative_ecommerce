import { Text, View } from 'react-native';

import { APP_NAME } from '@ecom/shared';

// Phase 1 smoke screen: proves NativeWind classes and the shared package both resolve.
export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-slate-900">{APP_NAME}</Text>
      <Text className="mt-2 text-slate-500">Mobile app scaffold is running.</Text>
    </View>
  );
}
