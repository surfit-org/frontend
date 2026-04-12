import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlatList, Image, View, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

// 서버에서 받아올 콘텐츠 정보
const images = [
  'https://www.chosun.com/resizer/v2/BPHJZFDSBJBPDEYFRCKLTL7ODQ.png?auth=319fd7c25042b8b6f7e16ca7ee7fd79efedaee884acbb2acf1c32fc4818a67c5&width=700&height=1243&smart=true',
  'https://www.chosun.com/resizer/v2/FK2MTEQ6WVBDPJGPU2EGG7CBZI.jpg?auth=a351edd708c6ff76e6c59dfc933f119c0a59a6cbf81b506b2c39c64b11243c9d&width=616',
];
const pages = [1, 2, 3, 4];

export default function Surf() {
  const { width, height } = useWindowDimensions();
  const colorScheme = useColorScheme() ?? 'dark';
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const pageHeight = height - tabBarHeight - insets.top;

  const [index, setIndex] = useState(0);

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={pages}
        keyExtractor={(item) => item.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        renderItem={() => (
          <ThemedView style={[styles.contentPage, { width, height: pageHeight }]}>
            <ThemedView style={styles.imageSection}>
              <FlatList
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={{ width, height: width }}
                onMomentumScrollEnd={(e) => {
                  const i = Math.round(e.nativeEvent.contentOffset.x / width);
                  setIndex(i);
                }}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    style={{ width, height: width }}
                    resizeMode="cover"
                  />
                )}
              />
              <ThemedView style={styles.dotRow}>
                {images.map((_, i) => (
                  <View
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      margin: 4,
                      backgroundColor:
                        i === index ? Colors[colorScheme].text : Colors[colorScheme].icon,
                    }}
                  />
                ))}
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.bottomContainer}>
              <ThemedText type="subtitle" style={{ paddingBottom: 10 }}>
                📈 경제
              </ThemedText>
              <ThemedView style={{ flexDirection: 'row' }}>
                <ThemedText type="default">
                  4월 10일 | {'"'}오늘의 한강물 온도는?{'"'} 토스 서비스...
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSection: {
    alignItems: 'center',
    width: '100%',
  },
  bottomContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 35,
    alignItems: 'flex-start',
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 8,
  },
});
