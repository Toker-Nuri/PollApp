/**
 * A single vote from a user.
 * Each vote belongs to one question and one option.
 *
 * @property id - The vote's unique ID.
 * @property created_at - When the vote was made.
 * @property question_id - The question the user voted on.
 * @property option_id - The option the user selected.
 */

export interface Vote {
  id: string;
  created_at: string;
  question_id: string;
  option_id: string;
}
