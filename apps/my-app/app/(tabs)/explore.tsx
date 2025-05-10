import { View, Text, Button } from "tamagui"

export default function ExploreScreen() {
  return (
    <View f={1} ai="center" jc="center" bg="#fff">
      <Text fontSize={32} fontWeight="bold" mb={16}>
        Explore
      </Text>
      <Button>Click me</Button>
    </View>
  )
}
