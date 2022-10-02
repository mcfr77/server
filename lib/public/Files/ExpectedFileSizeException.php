<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2022, Nextcloud
 *
 * @author Maxence Lange <maxence@artificial-owl.com>
 *
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program. If not, see <http://www.gnu.org/licenses/>
 *
 */

namespace OCP\Files;

use Exception;

/**
 * Actual file size is not the same as Expected (cached)
 *
 * @since 25.0.0
 */
class ExpectedFileSizeException extends Exception {
	/**
	 * @param string $message - some message
	 * @param int $actualFileSize - the real/actual size of the file
	 * @param Exception|null $previous
	 *
	 * @since 25.0.0
	 */
	public function __construct(
		string $message = '',
		int $actualFileSize = -1,
		\Exception $previous = null) {
		parent::__construct($message, $actualFileSize, $previous);
	}

	/**
	 * returns the real/actual size of the file, set at the generation of the exception
	 *
	 * @since 25.0.0
	 * @return int
	 */
	public function getActualFileSize(): int {
		return (int)$this->getCode();
	}
}
