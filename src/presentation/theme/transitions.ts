import {SharedTransition} from 'react-native-reanimated';

export const customSharedTransition = new SharedTransition()
  .duration(350)
  .springify()
  .damping(15)
  .stiffness(120);
