



function CustomDrawerContent(props) {
    // Your custom drawer content here
    return (
      <DrawerContentScrollView {...props}>
        {/* Your profile picture */}
        <View style={styles.picture}>
          {hasProfileImage ? (
            <Image source={{ uri: userData.profileImage }} style={styles.image} />
          ) : (
            <Text>No Profile Image</Text>
          )}
        </View>
  
        {/* Drawer items */}
        <DrawerItem
          label="Home"
          onPress={() => props.navigation.navigate('Home')}
        />
        <DrawerItem
          label="Admin"
          onPress={() => props.navigation.navigate('Admin')}
        />
        {/* Add more DrawerItems for other navigation options as needed */}
      </DrawerContentScrollView>
    );
  }