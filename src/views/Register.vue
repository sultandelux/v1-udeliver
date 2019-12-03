<template>
    <v-container fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Registration Form</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-text-field
                                name="nickname"
                                label="Nickname"
                                type="name"
                                v-model="nickname"
                                data-cy="registerNicknameField"
                                required
                            >
                            </v-text-field>
                            <v-text-field
                                name="phone"
                                label="Phone"
                                type="phone"
                                v-model="phone"
                                :rules="phoneRules"
                                data-cy="registerPhoneField"
                                required
                            >
                            </v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="primary"
                            :disabled="!phone"
                            @click="submit"
                            data-cy="joinSubmitBtn"
                            >Register</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'Register',
    data() {
        return {
            valid: false,
            phone: '',
            nickname: '',
            phoneRules: [
                // v => !v || 'Phone is required',
                // v => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(v) || 'Phone must be valid'
            ],
        };
    },
    methods: {
        submit() {
            // if (this.$refs.form.validate()) {
                this.$store.dispatch('signup', {
                    phone: this.phone,
                    nickname: this.nickname
                });
                this.phone = ''
                this.nickname = ''
            // }
        }
    }
};
</script>

<style scoped></style>
