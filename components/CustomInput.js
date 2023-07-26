import { TextInput, StyleSheet, Text, View } from 'react-native';

import { GlobalColors, GlobalStyles } from '../styles/global';

export default CustomInput = (props) => {
    return (
        <>
            <TextInput
                {...props}
                style={[styles.inputContainer, props.error && styles.borderRed]}
            />
            {props.errorText && (
                <View style={GlobalStyles.errorContainer}>
                    <Text style={GlobalStyles.errorText}>
                        {props.errorText}
                    </Text>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        borderWidth: 2,
        borderRadius: 8,
        borderColor: GlobalColors.mediumGrey,
        height: 50,
        width: 300,
        fontSize: 20,
        paddingHorizontal: 20,
        marginTop: 10,
    },
    borderRed: {
        borderColor: GlobalColors.hotPink,
    },
});
