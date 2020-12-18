<template>
    <v-container fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Code SMS</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form ref="form" v-model="valid">
                            <v-text-field
                                name="code"
                                label="code"
                                type="code"
                                v-model="code"
                                :rules="codeRules"
                                required
                                data-cy="loginCodeField"
                            >
                            </v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="primary"
                            :disabled="!valid"
                            @click="submit"
                            data-cy="loginSubmitBtn"
                            >Submit</v-btn
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
            code: '',
            codeRules: [
                // v => !!v || 'Phone is required',
                // v => /.+@.+/.test(v) || 'Phone must be valid'
            ],
        };
    },
    methods: {
        submit() {
            // if (this.$refs.form.validate()) {
                this.$store.dispatch('code', {
                    code: this.code,
                    // password: this.password
                });
            // }
        }
    }
};
</script>

<style scoped></style>
