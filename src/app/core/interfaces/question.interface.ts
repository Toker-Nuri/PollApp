/**
 * A single question inside a survey.
 * Each question can have multiple answer options.
 *
 * @property id - The question's unique ID.
 * @property created_at - When the question was created.
 * @property survey_id - The ID of the survey this question belongs to.
 * @property text - The actual question text shown to users.
 * @property allow_multiple - If true, users can pick more than one option.
 * @property order_index - The position of the question in the survey.
 */

export interface Question {
  id: string;
  created_at: string;
  survey_id: string;
  text: string;
  allow_multiple: boolean;
  order_index: number;
}
