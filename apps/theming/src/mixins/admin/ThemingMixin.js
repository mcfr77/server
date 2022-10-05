/**
 * @copyright 2022 Christopher Ng <chrng8@gmail.com>
 *
 * @author Christopher Ng <chrng8@gmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import '@nextcloud/dialogs/styles/toast.scss'

export default {
	emits: [
		'update:theming',
	],

	data() {
		return {
			showSuccess: false,
			errorMessage: '',
		}
	},

	computed: {
		id() {
			return `admin-theming-${this.name}`
		},
	},

	methods: {
		async save() {
			this.reset()
			const url = generateUrl('/apps/theming/ajax/updateStylesheet')

			try {
				await axios.post(url, { setting: this.name, value: this.value })
				this.$emit('update:value', this.value)
				this.showSuccess = true
				setTimeout(() => { this.showSuccess = false }, 2000)
				this.$emit('update:theming')
			} catch (e) {
				this.errorMessage = e.response.data.data.message
			}
		},

		async undo() {
			this.reset()
			const url = generateUrl('/apps/theming/ajax/undoChanges')

			try {
				const { data } = await axios.post(url, { setting: this.name })
				this.$emit('update:value', data.data.value)
				this.showSuccess = true
				setTimeout(() => { this.showSuccess = false }, 2000)
				this.$emit('update:theming')
			} catch (e) {
				this.errorMessage = e.response.data.data.message
			}
		},

		reset() {
			this.showSuccess = false
			this.errorMessage = ''
		},
	}
}
