export class Slug {
  public value: string

  constructor(value: string) {
    this.value = value
  }

  /**
   * Reveives a text and normalize it as a slug.
   *
   * Example: "An example title" -> "an-example-title
   *
   * @static
   * @param {string} text
   * @return {*}  {Slug}
   * @memberof Slug
   */
  static createFromText(text: string): Slug {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}
