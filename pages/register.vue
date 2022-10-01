<template>
  <PageWrapper>
    <section class="h-screen">
      <div class="px-6 h-full text-gray-800">
        <div
          class="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6"
        >
          <div
            class="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0"
          >
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              class="w-full"
              alt="Sample image"
            />
          </div>
          <div class="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
            <FormKit
              id="registration"
              type="form"
              submit-label="Register"
              :actions="false"
              @submit="submitHandler"
            >
              <FormKit
                v-model="username"
                type="text"
                name="username"
                class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="User name"
                validation="required|length:3"
              />

              <!-- Email input -->
              <FormKit
                v-model="identifier"
                type="text"
                name="email"
                class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="email"
                validation="required|email"
              />
              <!-- Password input -->

              <div class="double">
                <FormKit
                  v-model="password"
                  type="password"
                  name="password"
                  validation="required|length:6|matches:/[^a-zA-Z]/"
                  :validation-messages="{
                    matches: 'Please include at least one symbol',
                  }"
                  placeholder="Your password"
                  help="Choose a password"
                />
                <FormKit
                  type="password"
                  name="password_confirm"
                  placeholder="Confirm password"
                  validation="required|confirm"
                  help="Confirm your password"
                />
              </div>

              <div class="text-center lg:text-left">
                <FormKit type="submit" label="Register" />
              </div>
            </FormKit>
          </div>
        </div>
      </div>
    </section>
  </PageWrapper>
</template>

<script setup lang="ts">
// compiler macro
definePageMeta({
  layout: 'page',
})
//const { t } = useLang()
const { register } = useStrapiAuth()

const router = useRouter()

const identifier = ref('')
const password = ref('')
const username = ref('')

const submitHandler = async (data, node) => {
  console.log(`reg ${identifier.value} ${password.value}`)
  try {
    console.log(
      await register({
        username: username.value,
        email: identifier.value,
        password: password.value,
      })
    )

    const user = useStrapiUser()
    console.log('user ', user.value)

    router.push('/dashboard')
  } catch (err) {
    console.log(err)
    if (err.error.status == 400) {
      if (err.error.errors)
        node.setErrors(err.error.errors.map((e) => e.message))
      else node.setErrors([err.error.message])
    }
  }
}
</script>
