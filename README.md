
# NRV Dev Calendars

In the idea of "git-repo all the things", this repo serves as a focal point for all calendaring. To start, there's a calendar for upcoming CFPs (Call for Proposals/Presentations) to help us all be aware of speaking opportunities. In the future, there may be other calendars added as needed.


## Adding the feed to your calendar

Since the calendar is in iCal format, you can simply add it to your calendaring tool, including Google Calendar!

```
https://mikesir87.github.io/nrv-cfp-calendar/calendars/cfp-calendar.ical
```

## How do I contribute an event?

1. Find out about an event with an upcoming CFP deadline
2. Create a file in the `events` folder with the structure `YYYY-MM-DD-description` where the date reflects the date the CFP closes
3. In the file, describe the event in YAML format, using the schema below
4. Make a pull request to add the event
5. An automated build will run to make sure the request validates against the schema
6. Once merged, an automated build will run and update the ical feeds in the `calendar` directory


## Event File Format

The current version of the schema is Version 1.0. As such, each event file should contain the following:

```yaml
version: "1.0"

event:
  summary: Conference Name
  description: |
    A description about the conference. Why might I want to attend or speak? Can use copy from the event's website.
  url: https://www.conferencewebsite.io
  conference_dates:
    start: 2019-02-07
    end: 2019-02-08
  date_added: 2018-10-19
```

## Development

Interested in contributing/developing the app? Great!

```bash
yarn install
node src/index.js
```


## License

See [LICENSE](LICENSE)