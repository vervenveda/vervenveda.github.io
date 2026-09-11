# Future Birthday Wishes — Reserved Design

Automatic birthday greetings are **not enabled** by the Daily Admin Report.

The account model reserves these fields now:

- `birthday.month`
- `birthday.day`
- optional private `birthday.year`
- `birthdayWishesOptIn`
- `guardianBirthdayConsent` for minors
- verified delivery address
- preferred greeting/display name

## Privacy

The daily administrative email shows only month/day for learners.

A future greeting must not include:
- grades or progress alerts;
- health or diagnostic information;
- home address;
- family/custody information;
- exact age unless intentionally authorized.

## Future worker requirements

A birthday greeting may send only when:
1. the account holder opted in;
2. a minor has guardian consent;
3. the delivery address is verified;
4. the account is active;
5. the user/guardian can disable the greeting;
6. the message contains no unrelated private account information.

The daily report may identify an upcoming birthday. It does not send the birthday greeting.
