import { View, Text, Button } from "tamagui"

export default function HomeScreen() {
  return (
    <View f={1} ai="center" jc="center" bg="#fff">
      <Text fontSize={32} fontWeight="bold" mb={16}>
        Home
      </Text>
      <Button>Click me</Button>
    </View>
  )
}
