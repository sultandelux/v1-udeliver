<template>
    <v-container fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Login Form</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form ref="form" v-model="valid">
                            <v-text-field
                                name="phone"
                                label="Phone"
                                type="phone"
                                v-model="phone"
                                :rules="phoneRules"
                                required
                                data-cy="loginPhoneField"
                            >
                            </v-text-field>
                            <!-- <v-text-field
                                prepend-icon="lock"
                                name="password"
                                label="Password"
                                type="password"
                                data-cy="signinPasswordField"
                                v-model="password"
                                :rules="passwordRules"
                                required
                            >
                            </v-text-field> -->
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="primary"
                            :disabled="!valid"
                            @click="submit"
                            data-cy="loginSubmitBtn"
                            >Login</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            valid: false,
            phone: '',
            password: '',
            phoneRules: [
                v => !!v || 'Phone is required',
                v => /.+@.+/.test(v) || 'Phone must be valid'
            ],
            // passwordRules: [
            //     v => !!v || 'Password is required',
            //     v =>
            //         v.length >= 6 ||
            //         'Password must be greater than 6 characters'
            // ]
        };
    },
    methods: {
        submit() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('userLogin', {
                    phone: this.phone,
                    // password: this.password
                });
            }
        }
    }
};
</script>

<style scoped></style>
