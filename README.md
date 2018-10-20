
# NRV Dev CFP Calendar

As an effort to help increase awareness of local and regional conferences and events, this repo was created to provide the ability to crowdsource a calendar! Hopefully, this can help others have more speaking opportunities and help get our name out there a little more!

Simply put, add an event file and see it show up in the iCal feeds in the `calendars` directory!


## How do I contribute an event?

1. Find out about an event with an upcoming CFP deadline
2. Create a file in the `events` folder with the structure `YYYY-MM-DD-description` where the date reflects the date the CFP closes
3. In the file, describe the event in YAML format, using the schema below
4. Make a pull request to add the event
5. An automated build will run to make sure the request validates against the schema
6. Once merged, an automated build will run and update the ical feeds in the `calendar` directory


## Development

Interested in contributing/developing the app? Great!

```bash
yarn install
node src/index.js
```


## License

See [LICENSE](LICENSE)