module ApplicationHelper
  def is_iphone?
    user_agent = request.env["HTTP_USER_AGENT"]
    Rails.logger.info("USER AGENT: #{user_agent}")
    user_agent[/iPhone/] && !user_agent[/iPad/]
  end
  
  def podcast_url
    "http://itunes.apple.com/podcast/the-experiment/id292395055"
  end
  
  def tag_cloud(tags, classes)
    max, min = 0, 0
    tags.each do |tag|
      max = tag.count.to_i if tag.count.to_i > max
      min = tag.count.to_i if tag.count.to_i < min
    end

    divisor = ((max - min) / classes.size) + 1

    tags.each do |tag|
      yield tag, classes[(tag.count.to_i - min) / divisor]
    end
  end
end
